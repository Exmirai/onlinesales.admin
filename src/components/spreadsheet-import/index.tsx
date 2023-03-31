import { CircularProgress } from "@mui/material";
import { CustomizedSnackbar } from "components/snackbar";
import { initialSnackBarParams, uploadFailedSnackBarParams } from "components/snackbar/constants";
import { CoreModule } from "lib/router";
import { useState } from "react";
import { ReactSpreadsheetImport } from "@wavepoint/react-spreadsheet-import";
import { Result } from "@wavepoint/react-spreadsheet-import/types/types";
import { StyledBackdrop } from "./index.styled";
import { getImportFields } from "utils/import-key-mappings";
import { useCoreModuleNavigation } from "utils/helper";

interface csvImportPorps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (fileData: any) => void;
  object: any;
  endRoute: string;
}

export const CsvImport = ({ isOpen, onClose, onUpload, object, endRoute }: csvImportPorps) => {
  const handleNavigation = useCoreModuleNavigation();
  const [isUploading, setIsUploading] = useState(false);
  const [snackBarParams, setSnackBarParams] = useState(initialSnackBarParams);

  const onSubmit = async (data: Result<string>) => {
    try {
      if (data.validData.length === 0) {
        throw new Error("No valid data selected.");
      }
      setIsUploading(true);
      await onUpload(data);
      handleSuccess();
    } catch (error) {
      console.log(error);
      setSnackBarParams(uploadFailedSnackBarParams);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSuccess = () => {
    handleNavigation(endRoute);
  };

  return (
    <>
      <ReactSpreadsheetImport
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        fields={getImportFields(object)}
      />
      <StyledBackdrop open={isUploading}>
        <CircularProgress color="inherit" />
      </StyledBackdrop>
      <CustomizedSnackbar
        isOpen={snackBarParams.isOpen}
        severerity={snackBarParams.severity}
        message={snackBarParams.message}
        navigateTo={endRoute as CoreModule}
      />
    </>
  );
};
