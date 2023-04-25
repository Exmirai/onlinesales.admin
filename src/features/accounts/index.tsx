import { Avatar, Button, ListItemAvatar } from "@mui/material";
import { AccountDetailsDto, AccountImportDto } from "lib/network/swagger-client";
import { useRequestContext } from "providers/request-provider";
import { AccountListItem, AccountListItemText } from "./index.styled";
import {
  accountGridSettingsStorageKey,
  accountListCurrentBreadcrumb,
  defaultFilterOrderColumn,
  defaultFilterOrderDirection,
  modelName,
  searchLabel,
} from "./constants";
import { DataList } from "@components/data-list";
import { GridColDef } from "@mui/x-data-grid";
import { CoreModule, getAddFormRoute } from "lib/router";
import { ModuleWrapper } from "@components/module-wrapper";
import { dataListBreadcrumbLinks } from "utils/constants";
import { SearchBar } from "@components/search-bar";
import { Fragment, useRef, useState } from "react";
import { Add, Download, Upload } from "@mui/icons-material";
import { CsvImport } from "@components/spreadsheet-import";
import { CsvExport } from "@components/export";
import useLocalStorage from "use-local-storage";
import { dataListSettings } from "utils/types";
import { getModelByName } from "@lib/network/swagger-models";
import { Result } from "@wavepoint/react-spreadsheet-import/types/types";
import { GhostLink } from "@components/ghost-link";

export const Accounts = () => {
  const { client } = useRequestContext();
  const [gridSettings, setGridSettings] = useLocalStorage<dataListSettings | undefined>(
    accountGridSettingsStorageKey,
    undefined
  );

  const [searchTerm, setSearchTerm] = useState(gridSettings?.searchTerm ?? "");
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [importFieldsObject, setImportFieldsObject] = useState<any>();
  const dataExportQuery = useRef("");

  const getAccountList = async (mainQuery: string, exportQuery?: string) => {
    try {
      dataExportQuery.current = exportQuery || "";
      const result = await client.api.accountsList({
        query: mainQuery,
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const exportAccountsAsync = async () => {
    const response = await client.api.accountsExportList({
      query: dataExportQuery.current,
    });

    return response.text();
  };

  const handleImportOpen = () => {
    !importFieldsObject && setImportFieldsObject(getModelByName(modelName));
    setOpenImport(true);
  };

  const handleImportClose = () => {
    setOpenImport(false);
  };

  const handleExportOpen = () => {
    openExport ? setOpenExport(false) : setOpenExport(true);
  };

  const handleFileUpload = async (data: Result<string>) => {
    const importDtoCollection: AccountImportDto[] = data.validData;
    await client.api.accountsImportCreate(importDtoCollection);
  };

  const columns: GridColDef<AccountDetailsDto>[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 4,
      renderCell: ({ row }) => (
        <AccountListItem>
          <ListItemAvatar>
            <Avatar src={row.logoUrl || ""}></Avatar>
          </ListItemAvatar>
          <AccountListItemText primary={`${row.name || ""}`} secondary={row.siteUrl} />
        </AccountListItem>
      ),
    },
    {
      field: "state",
      headerName: "State",
      flex: 2,
    },
    {
      field: "countryCode",
      headerName: "Country Code",
      flex: 2,
    },
    {
      field: "cityName",
      headerName: "City",
      flex: 2,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 2,
      valueGetter: (params) => {
        const createdAt = params.value as string;
        const formattedDate = new Date(createdAt).toLocaleDateString();
        return formattedDate;
      },
    },
    {
      field: "continentCode",
      headerName: "Continent Code",
      flex: 2,
    },
  ];

  const searchBar = (
    <SearchBar
      setSearchTermOnChange={setSearchTerm}
      searchBoxLabel={searchLabel}
      initialValue={gridSettings?.searchTerm ?? ""}
    ></SearchBar>
  );

  const extraActions = [
    <Fragment key={"import-action"}>
      <Button key={"import-btn"} startIcon={<Upload />} onClick={handleImportOpen}>
        Import
      </Button>
      {importFieldsObject && (
        <CsvImport
          isOpen={openImport}
          onClose={handleImportClose}
          onUpload={handleFileUpload}
          object={importFieldsObject}
          endRoute={CoreModule.accounts}
        ></CsvImport>
      )}
    </Fragment>,
    <Fragment key={"export-action"}>
      <Button key={"export-btn"} startIcon={<Download />} onClick={handleExportOpen}>
        Export
      </Button>
      {openExport && (
        <CsvExport
          exportAsync={exportAccountsAsync}
          closeExport={handleExportOpen}
          fileName={"accounts"}
        ></CsvExport>
      )}
    </Fragment>,
  ];

  const addButton = (
    <Button variant="contained" to={getAddFormRoute()} component={GhostLink} startIcon={<Add />}>
      Add account
    </Button>
  );

  return (
    <ModuleWrapper
      breadcrumbs={dataListBreadcrumbLinks}
      currentBreadcrumb={accountListCurrentBreadcrumb}
      leftContainerChildren={searchBar}
      extraActionsContainerChildren={extraActions}
      addButtonContainerChildren={addButton}
    >
      <DataList
        columns={columns}
        gridSettingsStorageKey={accountGridSettingsStorageKey}
        defaultFilterOrderColumn={defaultFilterOrderColumn}
        defaultFilterOrderDirection={defaultFilterOrderDirection}
        searchText={searchTerm}
        getModelDataList={getAccountList}
        initialGridState={{
          columns: { columnVisibilityModel: { continentCode: false } },
          sorting: {
            sortModel: [{ field: defaultFilterOrderColumn, sort: defaultFilterOrderDirection }],
          },
        }}
      ></DataList>
    </ModuleWrapper>
  );
};
