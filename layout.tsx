export const metadata = {
  title: "Christmas Friendly Feud",
  description: "TV-ready Family Feud style party game"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
