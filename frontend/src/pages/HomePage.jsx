import PageContainer from "../components/layout/PageContainer";
import HomeTile from "../components/home/HomeTile";

export default function HomePage() {
  return (
    <PageContainer>
      <div className="home-grid">
        <HomeTile
          title="Inbox"
          description="Process new scans"
          countLabel="Open inbox workflow"
          to="/inbox"
        />

        <HomeTile
          title="Library"
          description="Browse collection"
          countLabel="Library view coming next"
          to="/library"
        />
      </div>
    </PageContainer>
  );
}