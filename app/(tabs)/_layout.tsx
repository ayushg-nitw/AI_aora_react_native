import { Text, View,Image,ImageSourcePropType } from 'react-native'
import {Tabs, Redirect} from 'expo-router'
import {icons} from '../../constants'

type TabIconProps = {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
};

const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
  return (
    <View className='items-center justify-center gap-2 w-16' >
      <Image
         source ={icon} 
         resizeMode="contain" 
         tintColor={color}
         className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-psemibold':'font-pregular'} text-xs text-center`} style ={{color:color}}>{name}</Text>
    </View>
  )
}

const TabLayout = () => {
  return (
    <>
    <Tabs 
    screenOptions={
      {
        tabBarShowLabel:false,
        tabBarActiveTintColor:'#FFA001',
        tabBarInactiveTintColor:"#CDCDE0",
        tabBarStyle:{
          paddingTop:10,
          backgroundColor:'#161622',
          borderTopWidth:1,
          borderTopColor:"#232533",
          height:65
        }

      }
      }>
       <Tabs.Screen
        name="home"
        options ={
          {
            title: "Home",
            headerShown: false,
            tabBarIcon: ({color,focused}) =>(
              <TabIcon 
                icon= {icons.home} 
                color= {color}
                name="Home"
                focused ={focused}
              />
            )
          }
        }
       />
       <Tabs.Screen
        name="bookmark"
        options ={
          {
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({color,focused}) =>(
              <TabIcon 
                icon= {icons.bookmark} 
                color= {color}
                name="Bookmark"
                focused ={focused}
              />
            )
          }
        }
       />
       <Tabs.Screen
        name="create"
        options ={
          {
            title: "Create",
            headerShown: false,
            tabBarIcon: ({color,focused}) =>(
              <TabIcon 
                icon= {icons.plus} 
                color= {color}
                name="Create"
                focused ={focused}
              />
            )
          }
        }
       />
       <Tabs.Screen
        name="profile"
        options ={
          {
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({color,focused}) =>(
              <TabIcon 
                icon= {icons.profile} 
                color= {color}
                name="Profile"
                focused ={focused}
              />
            )
          }
        }
       />
    </Tabs>
    </>
  )
}

export default TabLayout
