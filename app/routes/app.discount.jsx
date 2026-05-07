import { useLoaderData } from "react-router";
import { Page, Card, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  await authenticate.admin(request);
  return { status: "ok" };
}

export default function DiscountPage() {
  return (
    <Page title="Bundle Discount">
      <Card>
        <Text as="p">✅ App funcionando correctamente.</Text>
      </Card>
    </Page>
  );
}

