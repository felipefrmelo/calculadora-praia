import React, { useState, useEffect } from "react";
import {
  DataGrid,
  RowsProp,
  ColDef,
  ValueFormatterParams,
} from "@material-ui/data-grid";
import { Button, TextField, Grid } from "@material-ui/core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gridColumnGap: "2ch",
      marginBottom: "5ch",
    },
  })
);

interface IFields {
  descricao?: string;
  valor?: string;
}

export default function App() {
  const classes = useStyles();
  const [rows, setRows] = useState<RowsProp>([]);
  const [fields, setFields] = useState<IFields>({ descricao: "", valor: "" });
  var formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  useEffect(() => {
    const r = localStorage.getItem("rows");
    if (r) setRows(JSON.parse(r));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  }

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    await localStorage.setItem(
      "rows",
      JSON.stringify([...rows, factoryFields()])
    );

    setRows([...rows, factoryFields()]);
    setFields({ descricao: "", valor: "" });
  }

  async function handleDelete(id: number | string) {
    const newRows = rows.filter((row) => row.id !== id);

    await localStorage.setItem("rows", JSON.stringify(newRows));

    setRows(newRows);
  }

  const columns: ColDef[] = [
    { field: "col1", headerName: "Descrição", width: 230 },
    {
      field: "col2",
      headerName: "Valor",
      renderCell: ({ row }: ValueFormatterParams) => {
        return <div>{formatter.format(Number(row.col2))}</div>;
      },
      width: 230,
    },
    {
      field: "col3",
      headerName: " ",
      width: 150,
      renderCell: ({ row }: ValueFormatterParams) => (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={() => handleDelete(row.id)}
        >
          Deletar
        </Button>
      ),
    },
  ];

  return (
    <>
      <div style={{ height: 500 }}>
        <form className={classes.root} onSubmit={handleSubmit}>
          <TextField
            onChange={handleChange}
            size="small"
            name="descricao"
            label="Descricao"
            value={fields.descricao}
          />
          <TextField
            onChange={handleChange}
            size="small"
            name="valor"
            label="Valor"
            value={fields.valor}
          />
          <Button variant="contained" color="primary" type="submit">
            Adicionar
          </Button>
        </form>
        <DataGrid hideFooter rows={rows} columns={columns} />
      </div>
      <div style={{ position: "absolute", bottom: 0 }}>
        <Grid container alignItems="center" spacing={3} direction="row">
          <Grid item>
            <h2>Soma</h2>
          </Grid>
          <Grid item>
            {formatter.format(
              rows.reduce((soma, valor) => soma + Number(valor.col2), 0)
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );

  function factoryFields() {
    return {
      id: rows.length,
      col1: fields.descricao,
      col2: fields.valor,
      col3: rows.length,
    };
  }
}
