import React, { useState } from 'react';
import { connect } from 'react-redux';
import { NoData } from '../../../../component';
import { ToastSuccess, ToastError } from '../../../../component';
import TableApproval from '../../component/TableApproval';
import TableDevExtreme from "../../../../component/TableDevExtreme";

import { getAllBookHistory } from '../../../../redux/action/history';

function BookList(props) {
  const [loading, setLoading] = React.useState(false);
  const [historyBooks, setHistoryBooks] = React.useState(null);
  const [filterOptions, setFilterOptions] = React.useState({
    page: 1,
    limit: 5,
  });

  const getAllHistoryBook = filterOptions => {
    setLoading(true);
    props
      .getAllBookHistory(filterOptions)
      .then(res => {
        if (res) {
          setHistoryBooks(res.data);

          setLoading(false);
        }
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  React.useEffect(() => {
    getAllHistoryBook(filterOptions);
  }, []);

  const onPaginationUpdated = pagination => {
    setFilterOptions({
      page: pagination.page,
      limit: pagination.limit,
    });
  };
  function returnBook(id) {
    props.MakeReturnBook(id).then(res => {
      if (res.resp) {
        setLoading(false);
        getAllHistoryBook(filterOptions);
        ToastSuccess(res.msg);
      } else {
        setLoading(false);
        ToastError(res.msg);
      }
    });
  }

  React.useEffect(() => {
    getAllHistoryBook(filterOptions);
  }, [filterOptions]);


    const adjustIntegrationTable = (dataSource) => {
    return dataSource.map(rowData => {

      return {
        ...rowData,
        judul :rowData.book.judul,
        nama :rowData.user ? rowData.user.nama : '',
        npp :rowData.user ? rowData.user.npp : '',
        tahunTerbit : rowData.book.tahunTerbit,
        quantity : rowData.quantity,
      }
    })
  }


  if (loading) return null;
  return (
    <React.Fragment>

      {historyBooks !== null && historyBooks !== undefined && historyBooks.data.length !== 0 ? (
         <TableDevExtreme
            columns={[
              { name: 'code', title: 'Code' },
              { name: 'judul', title: 'Judul' },
              { name: 'tahunTerbit', title: 'Tahun Terbit' },
              { name: 'quantity', title: 'Jumlah' },
              { name: 'nama', title: 'Peminjam' },
              { name: 'npp', title: 'NPP' },
              { name: 'status', title: 'Status' },
            ]}
              columnExtensions={[
              {
                columnName: "code",
                width: 150,
                wordWrapEnabled: true
              },
              {
                columnName: "judul",
                width: 300,
                wordWrapEnabled: true
              },
              {
                columnName: "nama",
                width: 150,
                wordWrapEnabled: true
              },
               {
                columnName: "npp",
                width: 150,
                wordWrapEnabled: true
              },
              {
                columnName: "tahunTerbit",
                width: 150,
                wordWrapEnabled: true
              },
              {
                columnName: "quantity",
                width: 100,
                wordWrapEnabled: true
              },
              {
                columnName: "status",
                width: 150,
                wordWrapEnabled: true
              }
               ]}
            rows={adjustIntegrationTable(historyBooks.data)}
            />
      ) : (
          <NoData msg="Belum ada request dari user!" />
        )}
    </React.Fragment>
  );
}

export default connect(null, { getAllBookHistory })(BookList);
