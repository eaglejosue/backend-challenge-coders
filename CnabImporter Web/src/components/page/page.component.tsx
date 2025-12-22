interface PageProps {
  children: React.ReactNode | React.ReactNode[];
}

const Page = ({ children }: PageProps) => {
  return <div style={{ display: 'block' }}>{children}</div>;
};
export default Page;
