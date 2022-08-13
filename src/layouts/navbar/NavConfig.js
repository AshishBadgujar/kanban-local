// routes
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  kanban: getIcon('ic_kanban'),
};

const navConfig = [
  {
    items: [
      {
        title: 'kanban',
        path: '/',
        icon: ICONS.kanban,
      },
    ],
  },
];

export default navConfig;
