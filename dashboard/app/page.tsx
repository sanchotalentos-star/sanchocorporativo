import { redirect } from "next/navigation";

// Redireciona a raiz para o dashboard
export default function HomePage() {
  redirect("/dashboard");
}
