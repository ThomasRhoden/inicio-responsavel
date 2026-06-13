import './globals.css';

// Layout raiz da aplicação Next.js.
// Define metadados e o idioma padrão da página.
export const metadata = {
  title: 'Início Responsável',
  description: 'Plataforma de orientação fiscal e profissional',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
