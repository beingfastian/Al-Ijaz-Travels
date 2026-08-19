import { test } from 'node:test';
import assert from 'node:assert/strict';

import { buildCatalogue, baseCatalogue, monthCatalogue, priceFor, slugFor } from './catalogue.ts';
import { tiers, getTier } from '../data/tiers.ts';
import { baseDurations, monthDurations } from '../data/durations.ts';
import { months, getMonth } from '../data/months.ts';
import { totalNights } from './types.ts';

/**
 * The catalogue is generated, so these tests are the only thing standing between
 * a one-line mistake and 195 wrong pages. A hand-authored file shows you its
 * errors; a generator hides them behind a plausible-looking matrix.
 */

test('the matrix is exactly the size the URL structure demands', () => {
  assert.equal(baseCatalogue().length, 15, '3 tiers x 5 base durations');
  assert.equal(monthCatalogue().length, 180, '3 tiers x 5 month durations x 12 months');
  assert.equal(buildCatalogue().length, 195);
});

test('every slug is unique — a collision would silently drop a page', () => {
  const all = buildCatalogue();
  assert.equal(new Set(all.map((p) => p.slug)).size, all.length);
});

test('slugs match the competitor URL shape we are targeting', () => {
  assert.equal(slugFor(5, { nights: 10, makkah: 6, madinah: 4 }), '10-nights-5-star-umrah-package');
  assert.equal(
    slugFor(5, { nights: 10, makkah: 6, madinah: 4 }, 'january'),
    '10-nights-5-star-january-umrah-package'
  );
});

test('base packages carry no month; month packages always do', () => {
  for (const pkg of baseCatalogue()) {
    assert.equal(pkg.month, undefined, `${pkg.slug} should be evergreen`);
    assert.equal(pkg.departureMonths.length, 12, 'an evergreen package runs all year');
  }
  for (const pkg of monthCatalogue()) {
    assert.ok(pkg.month, `${pkg.slug} must name its month`);
    assert.deepEqual(pkg.departureMonths, [pkg.month]);
  }
});

test('the Makkah/Madinah split always sums to the total and favours Makkah', () => {
  for (const pkg of buildCatalogue()) {
    assert.equal(totalNights(pkg), pkg.nights.makkah + pkg.nights.madinah, pkg.slug);
    assert.ok(
      pkg.nights.makkah > pkg.nights.madinah,
      `${pkg.slug}: pilgrims want the longer leg in Makkah`
    );
  }
});

test('price rises with tier at equal duration', () => {
  const d = { nights: 10, makkah: 6, madinah: 4 };
  const three = priceFor(getTier(3), d);
  const four = priceFor(getTier(4), d);
  const five = priceFor(getTier(5), d);

  assert.ok(three < four && four < five, `${three} < ${four} < ${five}`);
});

test('a 14-night package is not double a 7-night one — the flight does not halve', () => {
  const tier = getTier(4);
  const seven = priceFor(tier, { nights: 7, makkah: 4, madinah: 3 });
  const fourteen = priceFor(tier, { nights: 14, makkah: 8, madinah: 6 });

  assert.ok(fourteen < seven * 2, `${fourteen} should be under ${seven * 2}`);
  assert.ok(fourteen > seven, 'but still more than the shorter stay');
});

test('Ramadan costs materially more than the off-peak months', () => {
  const tier = getTier(5);
  const d = { nights: 10, makkah: 6, madinah: 4 };

  const march = priceFor(tier, d, getMonth('march'));
  const september = priceFor(tier, d, getMonth('september'));

  assert.ok(march > september * 1.5, `Ramadan ${march} vs off-peak ${september}`);
});

test('every price is a clean multiple of 5 — no £1,347 on a card', () => {
  for (const pkg of buildCatalogue()) {
    assert.equal(pkg.price.gbp % 5, 0, `${pkg.slug} priced at ${pkg.price.gbp}`);
  }
});

test('the longest stays only depart from the direct-flight airports', () => {
  for (const pkg of buildCatalogue()) {
    if (totalNights(pkg) >= 20) {
      assert.deepEqual(
        [...pkg.departures].sort(),
        ['BHX', 'LHR', 'MAN'],
        `${pkg.slug}: two connections on a 20+ night trip is not something we would sell`
      );
    } else {
      assert.equal(pkg.departures.length, 6, `${pkg.slug} should run from all six`);
    }
  }
});

test('every package has one Makkah hotel and one Madinah hotel', () => {
  for (const pkg of buildCatalogue()) {
    const cities = pkg.hotels.map((h) => h.city).sort();
    assert.deepEqual(cities, ['madinah', 'makkah'], pkg.slug);
    for (const h of pkg.hotels) {
      assert.ok(h.distanceToHaramM > 0, `${pkg.slug}: ${h.name} needs a real distance`);
    }
  }
});

test('hotel star rating never contradicts the tier it is sold under', () => {
  for (const pkg of buildCatalogue()) {
    for (const h of pkg.hotels) {
      assert.equal(h.stars, pkg.tier, `${pkg.slug}: ${h.name} is ${h.stars}-star`);
    }
  }
});

test('the generator never asserts ATOL protection', () => {
  // Displaying an ATOL claim without holding one is actionable by the CAA, so it
  // must come from real accreditation data — never from a generator default.
  for (const pkg of buildCatalogue()) {
    assert.equal(pkg.atolProtected, false, `${pkg.slug} must not self-declare ATOL cover`);
  }
});

test('exactly one featured package per tier, so the home page stays balanced', () => {
  const featured = buildCatalogue().filter((p) => p.featured);
  assert.equal(featured.length, tiers.length);
  assert.equal(new Set(featured.map((p) => p.tier)).size, tiers.length);
});

test('every generated package is reachable by its own slug', () => {
  const all = buildCatalogue();
  const bySlug = new Map(all.map((p) => [p.slug, p]));

  for (const tier of tiers) {
    for (const d of baseDurations) {
      assert.ok(bySlug.has(slugFor(tier.tier, d)), `missing ${slugFor(tier.tier, d)}`);
    }
    for (const d of monthDurations) {
      for (const m of months) {
        assert.ok(bySlug.has(slugFor(tier.tier, d, m.key)), `missing ${slugFor(tier.tier, d, m.key)}`);
      }
    }
  }
});
