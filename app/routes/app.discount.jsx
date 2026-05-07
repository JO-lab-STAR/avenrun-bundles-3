import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  await authenticate.admin(request);
  return { status: "ok" };
}

export default function DiscountPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>✅ App funcionando correctamente.</h1>
    </div>
  );
}


