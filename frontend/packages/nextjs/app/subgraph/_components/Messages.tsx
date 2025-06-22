import { GetReceivedMessagesDocument, GetSentMessagesDocument, execute } from "~~/.graphclient";

type Props = {
  walletAddress: string;
};

export const RecievedMessagesTable = async ({ walletAddress }: Props) => {
  const { data, errors } = await execute(GetReceivedMessagesDocument, {
    reciever: walletAddress,
  });

  const messages = data?.messages ?? [];

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary">
                INBOX for {walletAddress.slice(0, 3)}...{walletAddress.slice(-5)}
              </th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.slice(0, 5).map((message: any) => (
                <tr key={message.id}>
                  <td>{message.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="italic text-gray-500">No received messages.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SentMessagesTable = async ({ walletAddress }: Props) => {
  const { data, errors } = await execute(GetSentMessagesDocument, {
    sender: walletAddress,
  });

  const messages = data?.messages ?? [];

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary">
                Last 5 Sent Messages from {walletAddress.slice(0, 3)}...
                {walletAddress.slice(-5)}
              </th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.slice(0, 5).map((message: any) => (
                <tr key={message.id}>
                  <td>{message.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="italic text-gray-500">No sent messages.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
