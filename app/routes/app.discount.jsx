import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const result = await admin.graphql(`
    mutation {
      discountAutomaticAppCreate(
        automaticAppDiscount: {
          title: "Bundle Discount"
          functionId: "208e9edf-8b9b-6b74-3f3a-539fdede2328"
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

  const json = await result.json();
  const userErrors = json.data.discountAutomaticAppCreate.userErrors;
  const discountId = json.data.discountAutomaticAppCreate.automaticAppDiscount?.discountId;

  return { discountId, userErrors };
}

export default function DiscountPage() {
  const { discountId, userErrors } = useLoaderData();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Debug Descuento</h2>
      <p>discountId: {discountId || "null"}</p>
      <p>userErrors: {JSON.stringify(userErrors)}</p>
    </div>
  );
}
