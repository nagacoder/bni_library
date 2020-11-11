import React, { useState } from 'react';
import { NoData } from '../../../../component';
import TableApproval from '../../component/TableApproval';
import { connect } from 'react-redux';
import { ToastSuccess, ToastError } from '../../../../component';
import { getAllEbookHistory } from '../../../../redux/action/history';
import TableDevExtreme from "../../../../component/TableDevExtreme";

function EbookList(props) {
  const [loading, setLoading] = React.useState(false);
  const [detailData, setDetailData] = useState({});
  const [historyEbooks, setHistoryEbooks] = React.useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  const getAllHistoryEbook = () => {
    setLoading(true);
     const pagination = {
      page : currentPage + 1,
      limit : pageSize
    }
    props
      .getAllEbookHistory(pagination)
      .then(res => {
        if (res) {
           setTotalCount(res.data.count);
          setHistoryEbooks(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  React.useEffect(() => {
    getAllHistoryEbook();
  },[currentPage,totalCount]);






   const adjustIntegrationTable = (dataSource) => {
    return dataSource.map(rowData => {

      return {
        ...rowData,
        judul :rowData.ebook && rowData.ebook.judul,
        nama :rowData.user ? rowData.user.nama : '',
        npp :rowData.user ? rowData.user.npp : '',
        tahunTerbit : rowData.ebook && rowData.ebook.tahunTerbit,
        quantity : rowData.quantity,
        actions : ( <React.Fragment>
              {rowData.status !== 'Dikembalikan' ? (
                <button
                  className="bg-green-400 text-white active:bg-indigo-600 text-xs   px-3 py-1 rounded outline-none focus:outline-none "
                  type="button"
                  style={{ marginRight: '5px' }}
                  onClick={() => console.log(rowData.id)}
                  disabled={rowData.status === 'Dikembalikan' ? true : false}
                >
                  Return Ebook
                </button>
              ) : (
                  '-'
                )}
            </React.Fragment>)
      }
    })
  }


  if (loading) return null;

  return (
    <React.Fragment>
      {historyEbooks !== null && historyEbooks.data.length !== 0 ? (
         <TableDevExtreme
             columns={[
              { name: 'code', title: 'Code' },
              { name: 'judul', title: 'Judul' },
              { name: 'tahunTerbit', title: 'Tahun Terbit' },
              { name: 'quantity', title: 'Jumlah ' },
              { name: 'nama', title: 'Peminjam' },
              { name: 'npp', title: 'NPP' },
              { name: 'status', title: 'Status' },
              { name: 'actions', title: 'Action' },
            ]}
            columnExtensions={[
              {
                columnName: "code",
                width: 150,
                wordWrapEnabled: true
              },
              {
                columnName: "judul",
                width: 250,
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
              },{
                columnName: "actions",
                width: 300,
                wordWrapEnabled: true
              }
               ]}
            rows={adjustIntegrationTable(historyEbooks.data)}
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
            pageSize={pageSize}
            totalCount={totalCount}
            />
      ) : (
          <NoData msg="Belum ada request Dari user!" />
        )}
    </React.Fragment>
  );
}

export default connect(null, { getAllEbookHistory })(EbookList);
