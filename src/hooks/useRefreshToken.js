import { useAuth } from "./useAuth";

// o refresh (single-flight, cookie refreshToken) vive no AuthProvider; este hook só o expõe
export const useRefreshToken = () => useAuth().refresh;
