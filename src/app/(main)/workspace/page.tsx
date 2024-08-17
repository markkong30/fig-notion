import { FC } from 'react';

type Props = {
  params: {
    id: string;
  };
};

const Workspace: FC<Props> = ({ params }) => {
  const workspaceId = params.id;

  return <div className=''>{workspaceId}</div>;
};

export default Workspace;
