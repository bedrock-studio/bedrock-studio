/**
 * Microsoft.Windows.Appx.PackageManager.Commands.AppxPackage
 */
export interface AppxPackage {
    "Name": string;
    "Publisher": string;
    "PublisherId": string;
    "Architecture": ProcessorArchitecture;
    "ResourceId": string;
    "Version": string;
    "PackageFamilyName": string;
    "PackageFullName": string;
    "InstallLocation": string;
    "IsFramework": boolean;
    "PackageUserInformation": unknown[];
    "IsResourcePackage": boolean;
    "IsBundle": boolean;
    "IsDevelopmentMode": boolean;
    "NonRemovable": boolean;
    "Dependencies": string[];
    "IsPartiallyStaged": boolean;
    "SignatureKind": PackageSignatureKind;
    "Status": AppxStatus;
}

/**
 * Windows.System.ProcessorArchitecture
 */
export enum ProcessorArchitecture {
    X86 = 0,
    Arm = 5,
    X64 = 9,
    Neutral = 11,
    Arm64 = 12,
    X86OnArm64 = 14,
    Unknown = 65535,
}

/**
 * Windows.ApplicationModel.PackageSignatureKind
 */
export enum PackageSignatureKind {
    None = 0,
    Developer = 1,
    Enterprise = 2,
    Store = 3,
    System = 4,
}

/**
 * Microsoft.Windows.Appx.PackageManager.Commands.AppxStatus
 */
export enum AppxStatus {
    Ok = 0,
    LicenseIssue = 1,
    Modified = 2,
    Tampered = 4,
    Disabled = 8,
    PackageOffline = 16,
    DeploymentInProgress = 32,
    DependencyIssue = 64,
    DataOffline = 128,
    IsPartiallyStaged = 256,
    NotAvailable = 512,
    Servicing = 1024,
    NeedsRemediation = 2048,
}
