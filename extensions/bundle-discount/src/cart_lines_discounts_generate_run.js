// @ts-check
import {
  ProductDiscountSelectionStrategy,
} from '../generated/api';

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
 */

/**
 * @param {RunInput} input
 * @returns {CartLinesDiscountsGenerateRunResult}
 */

export function run(input) {
  const operations = [];

  for (const line of input.cart.lines) {
    const product = line.merchandise?.product;
    if (!product) continue;



    const precio1 = parseFloat(product.metafield_precio1?.value || '0');
    const precio2 = parseFloat(product.metafield_precio2?.value || '0');
    const precio3 = parseFloat(product.metafield_precio3?.value || '0');

    if (!precio1 || !precio2 || !precio3) continue;

    const quantity = line.quantity;
    const originalPrice = parseFloat(line.cost.amountPerQuantity.amount);

    let bundlePrice = null;
    let message = '';

    if (quantity === 1) {
      bundlePrice = precio1;
      message = 'COMPRA 1';
    } else if (quantity === 2) {
      bundlePrice = precio2 / 2;
      message = 'COMPRA 2';
    } else if (quantity >= 3) {
      bundlePrice = precio3 / 3;
      message = 'COMPRA 3';
    }

    if (!bundlePrice || bundlePrice >= originalPrice) continue;

    const discountPercentage = ((originalPrice - bundlePrice) / originalPrice) * 100;

    operations.push({
      productDiscountsAdd: {
        candidates: [
          {
            message,
            targets: [{ cartLine: { id: line.id } }],
            value: {
              percentage: {
                value: parseFloat(discountPercentage.toFixed(2)),
              },
            },
          },
        ],
        selectionStrategy: ProductDiscountSelectionStrategy.First,
      },
    });
  }

  return { operations };
}

