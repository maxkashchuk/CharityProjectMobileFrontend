import { Text, View, FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import OutlineInput from "react-native-outline-input";
import { useState } from "react";
import { TextArea, Center, NativeBaseProvider } from "native-base";
import { Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import IconMaterialI from "react-native-vector-icons/MaterialIcons";
import { Button } from "react-native-elements";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFontisto from "react-native-vector-icons/Fontisto";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { Chip } from "react-native-paper";
import UserService from "../../Service/UserService";
import PostService from "../../Service/PostService";
import { Snackbar } from 'react-native-paper';

export default function AddPosts() {
  const [header, setHeader] = useState();

  const [description, setDescription] = useState();

  const [money, setMoney] = useState("");

  const [test, setTest] = useState([]);

  const [cordinate, setCordinate] = useState({
    latitude: 0,
    longitude: 0,
    longitudeDelta: 0.0922,
    latitudeDelta: 0.0421,
  });

  const [tags, setTags] = useState([]);

  const [preview, setPreview] = useState(null);

  const [markerShow, setMarkerShow] = useState(false);

  const [currentTag, setCurrentTag] = useState();

  const [visible, setVisible] = useState(false);

  const [snackBarText, setSnackBarText] = useState();

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  function isNumeric(n) {
    let num = !isNaN(parseFloat(n)) && isFinite(n);
    if ((num === true && parseFloat(n) > 0) || n === "") {
      return true;
    }
    return false;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setPreview(result.uri);
      setTest([...test, result.uri]);
      console.log(test);
    }
  };

  async function imagesSet() {
    let imgs = [];
    for (let i = 0; i < test.length; i++) {
      imgs.push(
        "data:image/jpeg;base64," +
          (await FileSystem.readAsStringAsync(test[i], { encoding: "base64" }))
      );
    }
    return imgs;
  }

  async function addPostRequest() {
    let post = {
      userID: await UserService.GetUser().then((res) => {
        return res;
      }),
      money: money === "" ? null : money,
      header: header,
      images: await imagesSet().then((res) => {
        return res;
      }),
      description: description,
      lattitude: markerShow === false ? null : cordinate.latitude,
      longtitude: markerShow === false ? null : cordinate.longitude,
      tags: tags,
    };
    await PostService.postAdd(post).then((res) => {setSnackBarText("Post was succesfully added"); onToggleSnackBar()})
    .catch((res) => {setSnackBarText("Check your data carefully"); onToggleSnackBar()});
  }

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <Snackbar
      style={{backgroundColor: "#6c63fe", width: 300, alignSelf: 'center'}}
        wrapperStyle={{ top: 150 }}
        visible={visible}
        onDismiss={onDismissSnackBar}
        >
        <Text style={{marginLeft: 30, fontSize: 18}}>{snackBarText}</Text>
      </Snackbar>
      <View
        style={{
          backgroundColor: "#6c63fe",
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 32,
            margin: 10,
            color: "white",
          }}
        >
          Create Post
        </Text>
      </View>
      <View style={{ padding: 5, marginTop: 20 }}>
        <Button
          type="outline"
          icon={
            <IconMaterialI
              name="post-add"
              size={25}
              color="#6c63fe"
              style={{ margin: 5 }}
            />
          }
          buttonStyle={{
            width: 300,
            alignSelf: "center",
            borderColor: "#6c63fe",
            borderWidth: 1,
          }}
          titleStyle={{ color: "#6c63fe" }}
          title="Add post"
          onPress={() => addPostRequest()}
        />
        <View style={{ marginTop: 80 }}>
          <OutlineInput
            value={header}
            onChangeText={(e) => {
              setHeader(e);
            }}
            label="Header"
            activeValueColor="#6c63fe"
            activeBorderColor="#6c63fe"
            activeLabelColor="#6c63fe"
            passiveBorderColor="#bbb7ff"
            passiveLabelColor="#bbb7ff"
            passiveValueColor="#bbb7ff"
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <View>
            <NativeBaseProvider>
              <Center flex={1} px="3">
                <TextArea
                  value={description}
                  onChangeText={(e) => setDescription(e)}
                  shadow={2}
                  h={20}
                  placeholder="Description"
                  w="370"
                  _light={{
                    placeholderTextColor: "#bbb7ff",
                    fontSize: 16,
                    color: "#bbb7ff",
                    borderColor: "#bbb7ff",
                    bg: "coolGray.100",
                    _hover: {
                      bg: "coolGray.200",
                      borderColor: "#6c63fe",
                      placeholderTextColor: "#6c63fe",
                      color: "#6c63fe",
                    },
                    _focus: {
                      bg: "coolGray.200:alpha.70",
                      borderColor: "#6c63fe",
                      placeholderTextColor: "#6c63fe",
                      color: "#6c63fe",
                    },
                  }}
                  _dark={{
                    bg: "coolGray.800",
                    _hover: {
                      bg: "coolGray.900",
                    },
                    _focus: {
                      bg: "coolGray.900:alpha.70",
                    },
                  }}
                />
              </Center>
            </NativeBaseProvider>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <OutlineInput
            value={money}
            onChangeText={(e) => {
              isNumeric(e) ? setMoney(e) : null;
              console.log(e);
            }}
            label="Money (optional)"
            activeValueColor="#6c63fe"
            activeBorderColor="#6c63fe"
            activeLabelColor="#6c63fe"
            passiveBorderColor="#bbb7ff"
            passiveLabelColor="#bbb7ff"
            passiveValueColor="#bbb7ff"
          />
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <View>
          <Button
            type="outline"
            icon={
              <IconEntypo
                name="images"
                size={20}
                color="#6c63fe"
                style={{ margin: 5 }}
              />
            }
            buttonStyle={{
              width: 300,
              alignSelf: "center",
              borderColor: "#6c63fe",
              borderWidth: 1,
            }}
            titleStyle={{ color: "#6c63fe" }}
            title="Pick images (optional)"
            onPress={pickImage}
          />
          <View style={{ flexDirection: "column" }}>
            {test.map((el, ind) => {
              return (
                <View key={ind}>
                  {preview && (
                    <Card
                      style={{
                        width: 300,
                        alignSelf: "center",
                        padding: 5,
                        marginTop: 30,
                      }}
                    >
                      <Card.Cover source={{ uri: test[ind] }} />
                      <Card.Actions>
                        <View style={{ width: "100%" }}>
                          <Button
                            type="outline"
                            buttonStyle={{
                              width: 250,
                              alignSelf: "center",
                              borderColor: "#6c63fe",
                              borderWidth: 1,
                            }}
                            titleStyle={{ color: "#6c63fe" }}
                            onPress={() => {
                              setTest(test.filter((el) => el !== test[ind]));
                            }}
                            color="#6c63fe"
                            title="Remove"
                          />
                        </View>
                      </Card.Actions>
                    </Card>
                  )}
                </View>
              );
            })}
          </View>
        </View>
        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 32,
              borderColor: "#6c63fe",
              borderRadius: 10,
              padding: 5,
              color: "#6c63fe",
              borderWidth: 2,
            }}
          >
            Set cordinates (optional)
          </Text>
        </View>
        <View
          style={{
            height: 250,
            width: 380,
            borderWidth: 1,
            marginTop: 20,
            marginLeft: 15,
            borderColor: "#6c63fe",
          }}
        >
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ width: "100%", height: "100%" }}
            initialRegion={{
              latitude: 48.3717299117799,
              longitude: 31.22193804010748,
              longitudeDelta: 19.74205847829581,
              latitudeDelta: 8.577949979622588,
            }}
            onPress={(e) => {
              setCordinate({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
                longitudeDelta: 0.0922,
                latitudeDelta: 0.0421,
              });
              setMarkerShow(true);
            }}
          >
            {markerShow && (
              <Marker
                title={header}
                description={description}
                coordinate={cordinate}
              >
                <IconMaterial
                  name="record-circle-outline"
                  size={30}
                  color="red"
                />
              </Marker>
            )}
          </MapView>
        </View>
        <View style={{ marginTop: 20 }}>
          <Button
            type="outline"
            onPressOut={() => setMarkerShow(false)}
            icon={
              <IconFontisto
                name="map"
                size={20}
                color="#6c63fe"
                style={{ margin: 5 }}
              />
            }
            buttonStyle={{
              width: 300,
              alignSelf: "center",
              borderColor: "#6c63fe",
              borderWidth: 1,
            }}
            titleStyle={{ color: "#6c63fe" }}
            title="Reset marker"
          />
        </View>
        <View style={{ marginTop: 30, marginBottom: 10 }}>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 32,
              borderColor: "#6c63fe",
              borderRadius: 10,
              padding: 5,
              color: "#6c63fe",
              borderWidth: 2,
            }}
          >
            Set tags
          </Text>
        </View>
        <View style={{ marginLeft: 30, marginRight: 30, marginTop: 10 }}>
          <OutlineInput
            value={currentTag}
            onChangeText={(e) => {
              setCurrentTag(e);
            }}
            label="Tag"
            activeValueColor="#6c63fe"
            activeBorderColor="#6c63fe"
            activeLabelColor="#6c63fe"
            passiveBorderColor="#bbb7ff"
            passiveLabelColor="#bbb7ff"
            passiveValueColor="#bbb7ff"
          />
        </View>
        <View style={{ marginTop: 20, marginBottom: 10, flexDirection: "row" }}>
          <Button
            type="outline"
            onPressOut={() =>
              currentTag !== undefined ? setTags([...tags, currentTag]) : null
            }
            icon={
              <IconAntDesign
                name="tagso"
                size={20}
                color="#6c63fe"
                style={{ margin: 5 }}
              />
            }
            buttonStyle={{
              width: 195,
              margin: 5,
              alignSelf: "center",
              borderColor: "#6c63fe",
              borderWidth: 1,
            }}
            titleStyle={{ color: "#6c63fe" }}
            title="Add current tag"
          />
          <Button
            type="outline"
            onPressOut={() => (currentTag !== undefined ? setTags([]) : null)}
            icon={
              <IconMaterialI
                name="clear"
                size={20}
                color="#6c63fe"
                style={{ margin: 5 }}
              />
            }
            buttonStyle={{
              width: 195,
              margin: 5,
              alignSelf: "center",
              borderColor: "#6c63fe",
              borderWidth: 1,
            }}
            titleStyle={{ color: "#6c63fe" }}
            title="Clear tags"
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <FlatList
            data={tags}
            renderItem={({ item }) => (
              <Chip
                style={{
                  alignSelf: "center",
                  width: 80,
                  height: 30,
                  borderWidth: 1,
                  margin: 5,
                  borderColor: "#6c63fe",
                  backgroundColor: "white",
                  marginTop: 10,
                }}
                textStyle={{ color: "#6c63fe" }}
                mode="outlined"
              >
                {item}
              </Chip>
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
}
