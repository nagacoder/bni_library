import React, { useState } from 'react';
import { NoData } from '../../../../component';
import TableApproval from '../../component/TableApproval';
import { connect } from 'react-redux';
import { ToastSuccess, ToastError } from '../../../../component';
import { MakeReturnEbook, ListTransactionEbook } from '../../../../redux/action/transaction';
import ModalDetailEbook from "./ModalDetailEBook";
import TableDevExtreme from "../../../../component/TableDevExtreme";
import ModalEditApproval from "./ModalEditApproval";


function EbookList(props) {
  const [loading, setLoading] = React.useState(false);
  const [filterOptions, setFilterOptions] = React.useState({
    page: 0,
    limit: 0,
  });
  const [detailData, setDetailData] = useState({});
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalEdit,setShowModalEdit] = useState(false);

  const mappingDataSourceTransactionEbookList = filterOptions => {
    setLoading(true);
    props
      .ListTransactionEbook(filterOptions)
      .then(res => {
        if (res) {
          setLoading(false);
        }
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  React.useEffect(() => {
    mappingDataSourceTransactionEbookList(filterOptions);
  }, []);

  // const onPaginationUpdated = pagination => {
  //   setFilterOptions({
  //     page: pagination.page,
  //     limit: pagination.limit,
  //   });
  // };

  const getEditTransactionEBook = (data) => {
    setDetailData(data);
    setShowModalEdit(true);
  }

  const getDetailDataEbook = data => {
    setDetailData(data);
    setShowModalDetail(true);
  };


  React.useEffect(() => {
    mappingDataSourceTransactionEbookList(filterOptions);
  }, [filterOptions]);
  function returnEbook(id) {
    props.MakeReturnEbook(id).then(res => {
      if (res.resp) {
        setLoading(false);
        mappingDataSourceTransactionEbookList(filterOptions);
        ToastSuccess(res.msg);
      } else {
        setLoading(false);
        ToastError(res.msg);
      }
    });
  }


    const adjustIntegrationTable = (dataSource) => {
    return dataSource.map(rowData => {

      return {
        ...rowData,
        judul :rowData.ebook.judul,
        nama :rowData.user ? rowData.user.nama : '',
         npp :rowData.user ? rowData.user.npp : '',
        tahunTerbit : rowData.ebook.tahunTerbit,
        actions : ( <React.Fragment>
           <button
                className="bg-orange-400 text-white active:bg-indigo-600 text-xs   px-3 py-1 rounded outline-none focus:outline-none "
                type="button"
                style={{ marginRight: '5px' }}
                onClick={() => getEditTransactionEBook(rowData)}
              >
                Edit
                </button>
              <button
                className="bg-green-400 text-white active:bg-indigo-600 text-xs   px-3 py-1 rounded outline-none focus:outline-none "
                type="button"
                style={{ marginRight: '5px' }}
                onClick={() => getDetailDataEbook(rowData)}
              >
                detail
                </button>
              {rowData.status !== 'Dikembalikan' ? (
                <button
                  className="bg-green-400 text-white active:bg-indigo-600 text-xs   px-3 py-1 rounded outline-none focus:outline-none "
                  type="button"
                  style={{ marginRight: '5px' }}
                  onClick={() => returnEbook(rowData.id)}
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
  const { transactionEbooks } = props;

  return (
    <React.Fragment>
      {transactionEbooks.data !== undefined && transactionEbooks.data.length !== 0 ? (
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
            rows={adjustIntegrationTable(transactionEbooks.data)}
            />
      ) : (
          <NoData msg="Belum ada request Dari user!" />
        )}
      <ModalDetailEbook
        showModalDetail={showModalDetail}
        detailData={detailData}
        onCloseModal={() => {
          setDetailData({});
          setShowModalDetail(false);
        }}
      />
      <ModalEditApproval
        showModalDetail={showModalEdit}
        detailData={detailData}
        typeApproval="editTransactionEBook"
        onCloseModal={() => {
          setDetailData({});
          setShowModalEdit(false);
        }}
      />
    </React.Fragment>
  );
}

let mapStateToProps = state => {
  return {
    transactionEbooks: state.transactions.transactionEbooks,
  };
};

export default connect(mapStateToProps, { ListTransactionEbook, MakeReturnEbook })(EbookList);
