import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
// import { moment } from 'moment';
import DatePicker from 'react-datepicker';
import { Input, Select } from 'antd';
import { updateMe, getWilayah } from '../../../../../redux/action/user';
import { ToastSuccess, ToastError } from '../../../../../component';
const { Option } = Select;

function EditUser(props) {
  const [dataWilayah, setDataWilayah] = React.useState([]);
  const [codeWilayah, setCodeWilayah] = React.useState([]);
  const [alamat, setAlamat] = React.useState([]);
  const [linkMap, setLinkMap] = React.useState([]);
  const [selectedAlamat, setSelectedAlamat] = React.useState({})
  const [selectedLinkMap, setSelectedLinkMap] = React.useState({});
  let isAdmin = localStorage.getItem('bni_UserRole') !== '1';
  const { handleSubmit, register, errors } = useForm();
  let [dateBorn, setDateBorn] = React.useState(null);
  function onSubmit(formData) {
    formData.tanggalLahir = dateBorn;
    formData.alamat = selectedAlamat.label
    debugger;
    props.updateMe(formData).then(res => {
      if (res.resp) {
        ToastSuccess(res.msg);
        if (isAdmin) {
          window.location.replace('/admin/dashboard');
        } else {
          props.changePages(false);
        }
      } else {
        ToastError(res.msg);
      }
    });
  }

  const getWilayah = () => {
    props.getWilayah().then(response => {
      let data = response.data.data.map(item => {
        return { label: item.wilayah, value: item.id }
      })
      setDataWilayah(data)
    })
  }
  const getCodeWilayahAndAlamat = () => {
    props.getWilayah().then(response => {
      let data = response.data.data.map(item => {
        return { label: item.codeWilayah, value: item.id }
      })
      let alamat = response.data.data.map(item => {
        return { label: item.alamat, value: item.id }
      })
      let linkMap = response.data.data.map(item => {
        return { label: item.linkGoogleMap, value: item.id }
      })
      console.log("alamat", alamat)
      setAlamat(alamat);
      setCodeWilayah(data)
      setLinkMap(linkMap)
    })
  }

  React.useEffect(() => {
    getWilayah();
    getCodeWilayahAndAlamat();
  }, [])

  function handleChange(value) {
    let data = alamat.filter(item => item.value === value);
    let lokasiMap = linkMap.filter(item => item.value === value);
    setSelectedLinkMap(lokasiMap[0]);
    setSelectedAlamat(data[0])
  }

  const ParserHTML = (htmlDocument) => {
    return {
      __html: htmlDocument,
    };
  };


  let { user } = props;
  return (
    <div class="bg-gray-100 rounded-lg shadow-lg pl-10 relative">
      <div class="px-4 py-8 flex">
        <div className="w-full lg:w-1/1 mt-6 pl-0 lg:pl-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">Nama</label>
              <input
                ref={register()}
                defaultValue={user.nama}
                type="text"
                name="nama"
                className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
                placeholder="Nama"
                style={{
                  transition: 'all 0.15s ease 0s',
                }}
              />
            </div>
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">Email</label>
              <input
                defaultValue={user.email}
                type="email"
                disabled
                className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-gray-100 rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
                placeholder="Email"
                style={{
                  transition: 'all 0.15s ease 0s',
                }}
              />
            </div>
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                Tanggal Lahir
              </label>
              <DatePicker
                selected={dateBorn}
                onChange={setDateBorn}
                className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
              />
            </div>
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                Wilayah
              </label>
              <Select
                defaultValue={user.wilayah}
                style={{ width: '100%' }}
                ref={register()}
                className="wilayah"
                name="wilayah"
              >
                {dataWilayah.map(op => {
                  return <Option value={op.label}>{op.label}</Option>;
                })}
              </Select>
            </div>
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                Singkatan
              </label>

              <Select
                defaultValue={user.singkatan}
                style={{ width: '100%' }}
                ref={register()}
                className="singkatan"
                name="singkatan"
              >
                {codeWilayah.map(op => {
                  return <Option value={op.label}>{op.label}</Option>;
                })}
              </Select>
            </div>
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">Unit</label>
              <input
                defaultValue={user.unit}
                ref={register()}
                name="unit"
                type="text"
                className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
                style={{
                  transition: 'all 0.15s ease 0s',
                }}
              />
            </div>
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                Kode Unit
              </label>
              <input
                defaultValue={user.kdunit}
                ref={register()}
                name="kdunit"
                type="text"
                className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
                style={{
                  transition: 'all 0.15s ease 0s',
                }}
              />
            </div>
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                Jabatan
              </label>
              <input
                defaultValue={user.jabatan}
                ref={register()}
                name="jabatan"
                type="text"
                className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
                style={{
                  transition: 'all 0.15s ease 0s',
                }}
              />
            </div>
            <div className="relative w-full mb-3">
              <label className="block uppercase text-gray-700 text-xs font-bold mb-2">Alamat</label>
              <Select
                defaultValue={user.alamat}
                style={{ width: '100%' }}
                onChange={handleChange}
                className="alamat"
                name="alamat"
              >
                {alamat.map(op => {
                  return <Option value={op.value}>{op.label}</Option>;
                })}
              </Select>
            </div>
            {selectedLinkMap ? <div className="relative w-full mb-3">
              <div style={{ width: '100%  ' }} dangerouslySetInnerHTML={ParserHTML(selectedLinkMap.label)}></div>
            </div> : null}


            <div className="mt-10">
              <button
                className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-32"
                type="submit"
                style={{
                  transition: 'all 0.15s ease 0s',
                }}
              >
                UPDATE
              </button>
              <button
                onClick={() => props.changePages(false)}
                className="bg-red-400 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-32"
                type="submit"
                style={{
                  transition: 'all 0.15s ease 0s',
                }}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    user: state.users.me,
  };
};
export default connect(mapStateToProps, { updateMe, getWilayah })(EditUser);
