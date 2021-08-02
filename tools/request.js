const Req = async () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  return await fetch(
    `https://quizapi.io/api/v1/questions?limit=10&apiKey=NvxTOU8faxaasxMxbDkebhceWnkiV2TAdZ710rk1&category=Code&tags=JavaScript`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error", error));
};
export default Req;
