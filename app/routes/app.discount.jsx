import { json } from "@remix-run/node";
import { useLoaderData } from "react-router";
import { Page, Card, Text, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  // Verificar si ya existe el descuento
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

  return json({ created: !alreadyExists });
}

export default function DiscountPage() {
  const { created } = useLoaderData();

  return (
    <Page title="Bundle Discount">
      <Card>
        {created ? (
          <Banner tone="success">
            <Text as="p">✅ Descuento "Bundle Discount" creado exitosamente.</Text>
          </Banner>
        ) : (
          <Banner tone="info">
            <Text as="p">ℹ️ El descuento "Bundle Discount" ya existe y está activo.</Text>
          </Banner>
        )}
        <Text as="p">
          Los productos con metafields precio1, precio2, precio3 recibirán descuentos automáticos.
        </Text>
      </Card>
    </Page>
  );
}
