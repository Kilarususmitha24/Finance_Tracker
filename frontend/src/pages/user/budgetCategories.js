import {
  Fastfood as FoodIcon,
  LocalDining as DiningIcon,
  DirectionsCar as TransportIcon,
  Home as HomeIcon,
  FlashOn as UtilitiesIcon,
  Movie as EntertainmentIcon,
  ShoppingCart as ShoppingIcon,
  Favorite as HealthIcon,
  School as EducationIcon,
  Category as OtherIcon,
} from "@mui/icons-material";

export const CATEGORY_LIST = [
  { name: "Groceries", icon: <FoodIcon fontSize="small" /> },
  { name: "Dining Out", icon: <DiningIcon fontSize="small" /> },
  { name: "Transportation", icon: <TransportIcon fontSize="small" /> },
  { name: "Housing", icon: <HomeIcon fontSize="small" /> },
  { name: "Utilities", icon: <UtilitiesIcon fontSize="small" /> },
  { name: "Entertainment", icon: <EntertainmentIcon fontSize="small" /> },
  { name: "Shopping", icon: <ShoppingIcon fontSize="small" /> },
  { name: "Health", icon: <HealthIcon fontSize="small" /> },
  { name: "Education", icon: <EducationIcon fontSize="small" /> },
  { name: "Other", icon: <OtherIcon fontSize="small" /> },
];
