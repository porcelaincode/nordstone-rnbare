import {useState} from 'react';
import {
  StatusBar,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {BoldText, Text, View} from '../components/Themed';
import Container from '../components/Container';
import CalculatorInput from '../components/CalculatorInput';

import useColorScheme from '../hooks/useColorScheme';

import Colors from '../theme/Colors';

export default function TabFourScreen() {
  const colorScheme = useColorScheme();
  const ops = [
    {
      text: '+',
      value: 'Add ( + )',
    },
    {
      text: '-',
      value: 'Subtract ( - )',
    },
    {
      text: '*',
      value: 'Multiply ( x )',
    },
  ];
  const [res, setRes] = useState<number>(0);
  const [fetching, setFetching] = useState(false);

  const [op, setOp] = useState(ops[0]);
  const [dropdown, setDropdown] = useState(false);
  const [nums, setNums] = useState<[string, string]>(['', '']);

  const fetchResult = async () => {
    setFetching(true);
    return fetch('https://nordstone-nodeapi.onrender.com/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Connection: 'keep-alive',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        numbers: [parseInt(nums[0]), parseInt(nums[1])],
        action: op.text,
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        json.error
          ? Alert.alert('Error occured fetching api. Check input')
          : setRes(json.result);
      })
      .catch(error => Alert.alert(error))
      .finally(() => setFetching(false));
  };

  return (
    <Container>
      <StatusBar
        backgroundColor={Colors[colorScheme].background}
        barStyle="dark-content"
      />
      <View style={{alignItems: 'flex-start'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {fetching && (
            <ActivityIndicator
              color={Colors[colorScheme].tint}
              style={{marginRight: 10}}
            />
          )}
          <BoldText
            style={{
              color: fetching
                ? Colors[colorScheme].tint
                : Colors[colorScheme].text,
            }}>
            Calculator
          </BoldText>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <CalculatorInput
            value={nums[0]}
            onChangeText={text => setNums([text, nums[1]])}
          />

          <TouchableOpacity
            style={{marginHorizontal: 10}}
            onPress={() => setDropdown(true)}>
            <Text
              style={{
                fontSize: 30,
                color: dropdown
                  ? Colors[colorScheme].tint
                  : Colors[colorScheme].text,
              }}>
              {op.text}
            </Text>
          </TouchableOpacity>

          <CalculatorInput
            value={nums[1]}
            onChangeText={text => setNums([nums[0], text])}
          />

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={fetchResult}
              style={{marginRight: 20, marginBottom: 5}}>
              <Text style={{fontSize: 30}}>=</Text>
            </TouchableOpacity>
            <Text digital={true}>{res}</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          display: dropdown ? 'flex' : 'none',
          zIndex: 999,
          left: 0,
          marginLeft: 110,
          marginTop: 120,
          position: 'absolute',
          width: 200,
          backgroundColor: Colors[colorScheme].background,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 7,
        }}>
        <FlatList
          data={ops}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                width: '90%',
                alignSelf: 'center',
                backgroundColor: Colors[colorScheme].tabIconDefault,
              }}
            />
          )}
          keyExtractor={item => item.text}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{height: 50, width: '100%', padding: 10}}
              onPress={() => {
                setOp(item);
                setDropdown(false);
              }}>
              <Text>{item.value}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Container>
  );
}
