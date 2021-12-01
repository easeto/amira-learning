package SingularSdkPlugin;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.*;

import com.singular.sdk.*;

import android.content.Context;

import com.google.android.gms.ads.identifier.AdvertisingIdClient;

/**
 * This class communicates device information to Singular SDK
 */
public class SingularSdkPlugin extends CordovaPlugin {
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("initSingular")) {
            String message = args.getString(0);
            this.initSingular(message, callbackContext);
            return true;
        }
        return false;
    }

    private void initSingular(String message, CallbackContext callbackContext) {
        String info = message.replace("[", "");
        info = info.replace("]","");
        info = info.replace("\"","");
        info = info.replace(" ","");
        String[] values = info.split(",");

        // callbackContext.success(values[0] + values[1] + values[2]);  //used to print off the values given

        SingularConfig config;
        if(values.length == 3) {
            config = new SingularConfig(values[0], values[1]).withCustomUserId(values[2]);
        } else if (values.length == 2) {
            config = new SingularConfig(values[0], values[1]);
        } else {
            callbackContext.error("SingularSdkPlugin expected an array of only 2 or 3 strings.");
            return;
        }
        Context context = this.cordova.getActivity().getApplicationContext();
        Singular.init(context, config);
        AdvertisingIdClient.Info adInfo;
        adInfo = null;
        try {
            adInfo = AdvertisingIdClient.getAdvertisingIdInfo(context);
            callbackContext.success(adInfo.getId());
        } catch(Exception e) {
            callbackContext.error("Error attempting to retrieve AIFA: " + e);
        }
    }
}
