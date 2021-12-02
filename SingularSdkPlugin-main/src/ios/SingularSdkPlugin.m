/********* Cordova-plugin-singular-sdk.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>
#import <Singular.h>
#import <AdSupport/ASIdentifierManager.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>


@interface SingularSdkPlugin : CDVPlugin {
  // Member variables go here.
}

- (void)initSingular:(CDVInvokedUrlCommand*)command;

- (void)requestPermission:(CDVInvokedUrlCommand*)command;

@end

@implementation SingularSdkPlugin

- (void)initSingular:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* phrase = [command.arguments objectAtIndex:0];
    phrase = [phrase description];
    phrase = [phrase stringByReplacingOccurrencesOfString:@"(" withString:@""];
    phrase = [phrase stringByReplacingOccurrencesOfString:@")" withString:@""];
    phrase = [phrase stringByReplacingOccurrencesOfString:@"\"" withString:@""];
    phrase = [phrase stringByReplacingOccurrencesOfString:@" " withString:@""];
    phrase = [phrase stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSArray* values = [phrase componentsSeparatedByString: @","];

    NSString *apiKey = [NSString stringWithFormat:@"%@", (NSString *) values[0]];
    NSString *secretKey = [NSString stringWithFormat:@"%@",(NSString *) values[1]];
    NSString *username = [NSString stringWithFormat:@"%@",(NSString *) values[2]];

    [Singular setCustomUserId:username];

    SingularConfig* config = [[SingularConfig alloc] initWithApiKey:apiKey andSecret:secretKey];
    config.skAdNetworkEnabled = YES;
    [Singular start:config];
    // [Singular startSession:apiKey withKey:secretKey];

    NSString *idfaString = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];

    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:idfaString];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)requestPermission:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        if (@available(iOS 14, *)) {
            [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
                CDVPluginResult* pluginResult =
                    [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsNSUInteger:status];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            }];
        } else {
            CDVPluginResult* pluginResult = [CDVPluginResult
                                             resultWithStatus:CDVCommandStatus_ERROR
                                             messageAsString:@"Only neccessary to request permission on iOS 14 devices or greater"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}
@end
