import { AlertColor } from "@mui/material";

export const initialSnackBarParams = {
  message: "",
  isOpen: false,
  severity: "success" as AlertColor,
};

export const fileUnsupportedSnackBarParams = {
  message: "Unsupported file type.",
  isOpen: true,
  severity: "error" as AlertColor,
};

export const uploadFailedSnackBarParams = {
  message: "Upload Failed",
  isOpen: true,
  severity: "error" as AlertColor,
};

export const uploadSuccessSnackBarParams = {
  message: "Uploaded Successfully",
  isOpen: true,
  severity: "success" as AlertColor,
};
