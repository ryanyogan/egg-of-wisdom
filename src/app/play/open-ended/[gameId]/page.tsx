type IParams = {
  params: {
    gameId: string;
  };
};

export default function OpenEndedGame(
  request: Request,
  { params }: { params: IParams }
) {
  return <div>GamePage</div>;
}
