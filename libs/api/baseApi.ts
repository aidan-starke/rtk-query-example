import { GraphQLClient } from "graphql-request";
import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";

const client = new GraphQLClient(
	"https://api.subquery.network/sq/AcalaNetwork/acala"
);

export const api = createApi({
	baseQuery: graphqlRequestBaseQuery({ client }),
	endpoints: () => ({}),
});
