import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  try {
    const existing = await admin.graphql(`
      query {
        automaticDiscountNodes(first: 10) {
          nodes {
            id
            automaticDiscount {
              ... on DiscountAutomaticApp {
                title
              }
            }
          }
        }
      }
    `);

    const data = await existing.json();
    const discounts = data.data.automaticDiscountNodes.nodes;
    const alreadyExists = discounts.some(
      (d) => d.automaticDiscount?.title === "Bundle Discount"
    );

    if (!alreadyExists) {
      await admin.graphql(`
        mutation {
          discountAutomaticAppCreate(
            automaticAppDiscount: {
              title: "Bundle Discount"
              functionId: "208e9edf-8b9b-6b74-3f3a-539fdede2328f859a084"
              startsAt: "2026-01-01T00:00:00Z"
            }
          ) {
            automaticAppDiscount {
              discountId
            }
            userErrors {
              field
              message
            }
          }
        }
      `);
    }

    return { created: !alreadyExists, error: null };
  } catch (e) {
    return { created: false, error: e.message };
  }
}

export default function DiscountPage() {
  const { created, error } = useLoaderData();

  return (
    <div style={{ padding: "20px" }}>
      {error ? (
        <p>❌ Error: {error}</p>
      ) : created ? (
        <p>✅ Descuento "Bundle Discount" creado exitosamente.</p>
      ) : (
        <p>ℹ️ El descuento "Bundle Discount" ya existe y está activo.</p>
      )}
    </div>
  );
}



