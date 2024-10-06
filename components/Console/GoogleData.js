import { useEffect, useState } from 'react';
import useGoogleData from '@/hooks/useGoogleData';
import DisplayData from './DisplayData';
import ConsoleButton from './ConsoleButton';

function GoogleData() {
  const [data, setData] = useState('');

  const {
    data: googleData,
    isPending: googlePending,
    isError,
  } = useGoogleData();

  useEffect(() => {
    if (googleData && !googleData.error) {
      const { rows } = googleData;

      let data = {
        labels: [],
        clicks: [],
        impressions: [],
      };

      for (let i = 0; i < rows.length; i++) {
        const { keys, clicks, impressions } = rows[i];
        data.labels.push(keys[0]);
        data.clicks.push(clicks);
        data.impressions.push(impressions);
      }

      setData(data);
    }
  }, [googleData]);

  // console.log("data", googleData);

  return (
    <div className="mt-12 flex justify-center">
      {googlePending ? (
        'Loading...'
      ) : data ? (
        <DisplayData consoleData={data} />
      ) : (
        <ConsoleButton />
      )}
    </div>
  );
}

export default GoogleData;
