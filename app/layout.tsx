import "./globals.css";

export const metadata = {
  title: "AgentPay Firewall",
  description: "Financial control plane for autonomous AI payments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
