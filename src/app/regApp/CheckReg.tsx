import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookieUtils';
import { checkUserReg } from '../../shared/api/regApi';

const tg_data = window.Telegram.WebApp.initDataUnsafe;
const id = tg_data.user?.id;

const CheckReg = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const userVerified = getCookie('userVerified') === 'true';

    if (id && !userVerified) {
        checkUserReg(id, navigate).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
};

export default CheckReg;
