import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { getMe } from '../../../../redux/action/user';
import Information from './component/information';
import EditUser from './component/editForm';
function Profile(props) {
  let [isEditUser, setIsEditUser] = React.useState(false);
  let [processing, setProcessing] = React.useState(false);
  let [user, setUser] = React.useState(null);
  React.useEffect(() => {
    props.getMe().then(res => {
      setProcessing(false);
      if (res.resp) {
        setUser(res.data);
      }
    });
  }, []);
  React.useEffect(() => {
    if (!isEditUser) {
      props.getMe().then(res => {
        setProcessing(false);
        if (res.resp) {
          setUser(res.data);
        }
      });
    }
  }, [isEditUser]);
  if (processing && user === null) return null;
  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Akun | Ebni</title>
      </Helmet>
      <div className="bg-gray-300 uppercase text-gray-900 text-base font-semibold py-4 pl-6">
        Informasi Kontak
      </div>
      {!isEditUser ? (
        <Information user={user} changePages={setIsEditUser} />
      ) : (
        <EditUser changePages={setIsEditUser} />
      )}
    </React.Fragment>
  );
}

export default connect(null, { getMe })(Profile);
