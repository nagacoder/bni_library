import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getEbooks, DeleteEbookAction } from '../../../../redux/action/ebooks';
import { NoData } from '../../../../component';
import Modal from '../../../../component/Modal';
import Table from '../../component/Table';

const Ebooks = props => {
  const [loading, setLoading] = React.useState(false);
  const [detailData, setDetailData] = useState({});
  const [showModalDeletion, setShowModalDeletion] = useState(false);
  const [filterOptions, setFilterOptions] = React.useState({
    page: 1,
    limit: 5,
  });

  const mappingDataSourceEbookList = filterOptions => {
    setLoading(true);
    props
      .getEbooks(filterOptions)
      .then(res => {
        if (res) {
          setLoading(false);
        }
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  const getDetailEbook = id => {
    const { books } = props;
    let detailData = books.data.filter(item => item.id === id);
    setDetailData(detailData[0]);
    setShowModalDeletion(true);
  };

  const handleActionDeleteEbook = () => {
    setLoading(true);
    props
      .DeleteBookAction(detailData.id)
      .then(response => {
        mappingDataSourceEbookList(filterOptions);
        setLoading(false);
        setShowModalDeletion(false);
      })
      .catch(err => console.log('err', err));
  };

  React.useEffect(() => {
    mappingDataSourceEbookList(filterOptions);
  }, []);

  const onPaginationUpdated = pagination => {
    setFilterOptions({
      page: pagination.page,
      limit: pagination.limit,
    });
  };

  React.useEffect(() => {
    mappingDataSourceEbookList(filterOptions);
  }, [filterOptions]);

  if (loading) return null;
  const { ebooks } = props;

  const columns = [
    {
      name: 'code',
      displayName: 'Code',
    },
    {
      name: 'title',
      displayName: 'Title',
    },
    {
      name: 'category',
      displayName: 'Category',
    },
    {
      name: 'author',
      displayName: 'Author',
    },
    {
      name: 'actions',
      displayName: 'Actions',
      customRender: rowData => {
        return (
          <React.Fragment>
            <React.Fragment>
              <button
                className="bg-green-400 text-white active:bg-indigo-600 text-xs   px-3 py-1 rounded outline-none focus:outline-none "
                type="button"
                style={{ marginRight: '5px' }}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white active:bg-indigo-600 text-xs   px-3 py-1 rounded outline-none focus:outline-none "
                type="button"
                onClick={() => getDetailEbook(rowData.id)}
              >
                Delete
              </button>
            </React.Fragment>
          </React.Fragment>
        );
      },
    },
  ];

  return (
    <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
      <main className="w-full flex-grow p-6">
        <h1 className="w-full text-3xl text-black pb-6">Daftar Ebook</h1>
        <div className="w-2/12 absolute " style={{ right: '2em', top: '5em' }}>
          <Link to="/admin/add-new-ebook">
            <button
              type="button"
              className="w-full bg-gray-800 text-white font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-700 flex items-center justify-center"
            >
              <i className="fas fa-plus mr-3" /> Ebook Baru
            </button>
          </Link>
        </div>

        {ebooks.data !== undefined && ebooks.data.length !== 0 ? (
          <Table
            columns={columns}
            source={ebooks}
            isLoading={loading}
            limit={filterOptions.limit}
            page={filterOptions.page}
            onPaginationUpdated={onPaginationUpdated}
          />
        ) : (
          <NoData msg="Data belum tersedia !" />
        )}
      </main>
      <Modal
        title="Konfirmasi"
        open={showModalDeletion}
        onCLose={() => {
          setDetailData({});
          setShowModalDeletion(false);
        }}
        handleSubmit={handleActionDeleteEbook}
      >
        <div className="my-5">Anda yakin untuk menghapus user ini?</div>
      </Modal>
    </div>
  );
};

let mapStateToProps = state => {
  return {
    ebooks: state.ebooks.ebooks,
  };
};

export default connect(mapStateToProps, { getEbooks, DeleteEbookAction })(Ebooks);
