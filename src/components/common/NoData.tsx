import React from 'react';
import { Button, Empty, Typography } from 'antd';
interface NoDataProps {
    description: string;
}

const NoData: React.FC<NoDataProps> = ({ description }) => (
  <Empty
    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
    className='w-full'
    imageStyle={{display: "flex", justifyContent: "center"}}
    description={
      <Typography.Text>
        {description}
      </Typography.Text>
    }
  >
  </Empty>
);

export default NoData;