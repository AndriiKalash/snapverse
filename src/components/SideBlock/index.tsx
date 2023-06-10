import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import styles from "./SideBlock.module.scss";
import { ReactNode } from "react";

interface SideBlockProps {
  title: string;
  children: ReactNode;
}

export const SideBlock: React.FC<SideBlockProps> = ({ title, children }) => {
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography variant="h6" classes={{ root: styles.title }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};
