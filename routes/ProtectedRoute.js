import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import UserStore, { useAuthListener } from "../zustand/UserStore";
import useModalStore from "../zustand/ModalStore";
import useRouteStore from "../zustand/RouteStore";

const ProtectedRoute = ({ children }) => {
  useAuthListener();

  const { isAuthenticated } = UserStore();
  const { openModal } = useModalStore();
  const { setRequestedRoute, requestedRoute, clearRequestedRoute } = useRouteStore();


  const navigation = useNavigation();
  const route = useRoute();

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {

    if (!isAuthenticated) {
      setRequestedRoute(route.name, route.params);
      openModal(); 
      setShouldRender(false);
    } else {
      setShouldRender(true);

      if (requestedRoute?.routeName && route.name !== requestedRoute.routeName) {
        navigation.replace(requestedRoute.routeName, requestedRoute.params || {});
        clearRequestedRoute();
      }
    }
  }, [isAuthenticated]);

  if (!shouldRender) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
