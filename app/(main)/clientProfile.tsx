import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import { myTheme } from "@/constants/theme";
import Avatar from "@/components/Avatar";
import {
  fetchPosts,
  fetchPostsAboutClient,
  fetchUserDetails,
} from "@/services/postService";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import { useTheme } from "react-native-paper";
import { translate } from "@/i18n";
import { fetchClientDetails } from "@/services/clientService";

var limit = 0;

interface Client {
  id: number | string;
  created_at: string;
  first_name: string;
  last_name: string;
  profile_image: string | string[];
}

const ClientProfile = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { clientId } = useLocalSearchParams();
  const [postsAboutClient, setPostsAboutClient] = useState<any>([]);
  const [clientData, setClientData] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const getPosts = async () => {
    if (!hasMore) return null;
    limit = limit + 10;

    let res = await fetchPostsAboutClient(limit, clientId as string);

    if (res.success) {
      //   TODO Known bug that it doesn't update hasMore (loading more posts) stte unless you scroll up a little bit.
      //   Seems like it has to do with the flatlist and not synchronizing data (i.e. setTimeout won't fitx it)
      if (postsAboutClient.length == res?.data?.length) {
        setHasMore(false);
      }

      setPostsAboutClient(res.data);
    }
  };

  // TODO How to handle userLocalSearchPArams being string or str[] in TS
  useEffect(() => {
    if (!clientId || !clientId?.[0]) {
      console.log(`hello mr jhawn`);
      //   return null;
    }

    getClientDetails(clientId as string);
  }, []);

  const getClientDetails = async (clientId: number | string) => {
    setLoading(true);
    let res = await fetchClientDetails(clientId);

    if (res?.success) {
      setClientData(res?.data);
    }
    setLoading(false); // in postDetails
  };

  return (
    <ScreenWrapper>
      <FlatList
        data={postsAboutClient}
        ListHeaderComponent={
          <>
            <ClientHeader client={clientData} />
            <View
              style={[
                styles.horizontalLine,
                { borderBottomColor: theme.colors.onBackground },
              ]}
            />
            <Text style={{ color: theme.colors.secondary }}>
              {translate("common:recentPosts")}
            </Text>
          </>
        }
        ListHeaderComponentStyle={{ marginBottom: 30 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard
            item={item}
            currentUser={user}
            router={router}
            canNavigateToUser={false}
          />
        )}
        onEndReached={() => {
          getPosts();
        }}
        ListFooterComponent={
          hasMore ? (
            <View
              style={{
                marginVertical: postsAboutClient.length == 0 ? 100 : 30,
              }}
            >
              <Loading />
            </View>
          ) : (
            <View style={{ marginVertical: 30 }}>
              <Text
                style={[
                  styles.noPosts,
                  {
                    color: theme.colors.onBackground,
                  },
                ]}
              >
                {translate("common:endOfList")}
              </Text>
            </View>
          )
        }
      />
    </ScreenWrapper>
  );
};

/* 
  "profile_image": "[\"postImages/1732395291175.png\",\"postImages/1732395291176.png\"]"
*/
const ClientHeader = ({ client }: { client: Client }) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: wp(4),
        backgroundColor: theme.colors.background,
      }}
    >
      <View>
        <Header title={translate("common:client")} showBackButton />
      </View>

      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              //   I have no freaking clue why you can do it inline here but as soon as it's a function...everything goes out the window
              uri={client?.profile_image?.slice(
                client?.profile_image?.indexOf("postImages"),
                client?.profile_image?.indexOf(
                  ".png",
                  client?.profile_image?.indexOf("postImages")
                ) + 4
              )}
              size={hp(12)}
              rounded={myTheme.radius.xxl * 1.4}
            />
          </View>

          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.username,
                {
                  color: theme.colors.onBackground,
                },
              ]}
            >
              {client?.first_name && client?.first_name && client?.last_name
                ? `${client?.first_name} ${client?.last_name}`
                : client?.first_name}
            </Text>

            {/* DEBUG TEXT */}
            {/* <Text style={{ color: "red" }}>{typeof client?.profile_image}</Text>
            <Text style={{ color: "red" }}>
              {JSON.stringify(client, null, 2)}
            </Text> */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ClientProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: wp (4)
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  username: {
    fontSize: hp(3),
    fontWeight: "500",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: "500",
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    // backgroundColor: theme.colors.roseLight,
  },
  horizontalLine: {
    marginVertical: 20,
    justifyContent: "center",
    alignSelf: "center",
    borderBottomWidth: 0.3,
    width: wp(50),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    // backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "400",
    // color: '#0c0c0c',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  section: {
    // paddingHorizontal: 24,
  },
  sectionTitle: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: "600",
    // color: '#9e9e9e',
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
});
