// routes
import DashboardLayout from './layouts';
import Kanban from './pages/Kanban';
// theme
import ThemeProvider from './theme';

export default function App() {
  return (
    <ThemeProvider>
      <DashboardLayout>
        <Kanban />
      </DashboardLayout>
    </ThemeProvider>
  );
}
