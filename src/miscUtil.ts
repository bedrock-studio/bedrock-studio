/* eslint-disable @typescript-eslint/camelcase */

import { execFile } from 'child_process';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

import { AppxPackage } from './appxTypes';

/**
 * Gets the Bedrock data location.
 */
export async function getBedrockDataLocation(): Promise<string> {
    const platform = os.platform();
    switch (platform) {
        case "win32": return getBedrockDataLocation_Windows();
        case "darwin": return getBedrockDataLocation_MacOS();
        case "linux": return getBedrockDataLocation_Linux();
        default:
            throw new Error(`Could not determine the location of Bedrock's data files. The current platform (${platform}) is not supported. Supported platforms: win32 (Windows), darwin (MacOS), linux`);
    }
}

/**
 * Gets the Bedrock data location on Windows.
 */
export async function getBedrockDataLocation_Windows(): Promise<string> {
    if (process.env["LOCALAPPDATA"]) {
        return path.join(process.env["LOCALAPPDATA"], "Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang");
    }
    else {
        throw new Error("Could not determine the location of Bedrock's data files. The LOCALAPPDATA environment variable is missing.");
    }
}

/**
 * Gets the Bedrock data location on MacOS.
 */
export async function getBedrockDataLocation_MacOS(): Promise<string> {
    return path.join(os.homedir(), "Library/Application Support/mcpelauncher/games/com.mojang");
}

/**
 * Gets the Bedrock data location on Linux.
 */
export async function getBedrockDataLocation_Linux(): Promise<string> {
    return path.join(os.homedir(), ".local/share/mcpelauncher/games/com.mojang");
}

/**
 * Gets the Bedrock assets location.
 */
export async function getBedrockAssetsLocation(): Promise<string> {
    const platform = os.platform();
    switch (platform) {
        case "win32": return getBedrockAssetsLocation_Windows();
        case "darwin": return getBedrockAssetsLocation_MacOS();
        case "linux": return getBedrockAssetsLocation_Linux();
        default:
            throw new Error(`Could not determine the location of Bedrock's asset files. The current platform (${platform}) is not supported. Supported platforms: win32 (Windows), darwin (MacOS), linux`);
    }
}

/**
 * Gets the Bedrock assets location on Windows.
 *
 * Since Bedrock on Windows is installed as a Windows Store package, it's
 * install location changes for each version. Here we use a powershell
 * command to get the package data which contains the current location.
 */
export async function getBedrockAssetsLocation_Windows(): Promise<string> {
    return new Promise((resolve, reject) => {
        execFile(
            "powershell.exe",
            [
                "-NoLogo",
                "-NoProfile",
                "-NonInteractive",
                "-WindowStyle", "Hidden",
                "-Command", "& {Get-AppxPackage -Name Microsoft.MinecraftUWP | ConvertTo-Json -Compress -Depth 1}"
            ],
            {
                timeout: 500,
                windowsHide: true
            },
            (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Could not determine the location of Bedrock's asset files. There was an error executing the package details command:\n${stderr}`));
                }
                else if (stderr) {
                    reject(new Error(`Could not determine the location of Bedrock's asset files. The package details command returned the following error:\n${stderr}`));
                }
                else {
                    try {
                        const packageData = JSON.parse(stdout) as AppxPackage;
                        resolve(path.join(packageData.InstallLocation, "data"));
                    }
                    catch (e) {
                        reject(new Error(`Could not determine the location of Bedrock's asset files. The output of the package details command was not valid JSON.\n----- Output -----\n${stdout}\n------------------`));
                    }
                }
            }
        );
    });
}

/**
 * Gets the Bedrock install location on MacOS.
 *
 * MacOS doesn't have an official bedrock release. The current solution uses
 * the `mcpe-launcher` project which always installs to
 * `~/Library/Application Support/mcpelauncher/`.
 */
export async function getBedrockAssetsLocation_MacOS(): Promise<string> {
    return getBedrockAssetsLocation_mcpelauncher(path.join(os.homedir(), "Library/Application Support/mcpelauncher/"));
}

/**
 * Gets the Bedrock assets location on Linux.
 *
 * Linux doesn't have an official bedrock release. The current solution uses
 * the `mcpe-launcher` project which always installs to
 * `~/.local/share/mcpelauncher/`.
 */
export async function getBedrockAssetsLocation_Linux(): Promise<string> {
    return getBedrockAssetsLocation_mcpelauncher(path.join(os.homedir(), ".local/share/mcpelauncher/"));
}

/**
 * Gets the assets location for the most recent minecraft version in an
 * mcpe-launcher installation.
 * @param rootInstallPath The mcpe-launcher installation path
 */
export async function getBedrockAssetsLocation_mcpelauncher(rootInstallPath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        // Get the versions file
        const versionsIni = path.join(rootInstallPath, "versions/versions.ini");
        fs.readFile(
            versionsIni,
            {
                encoding: 'utf8',
                flag: 'r'
            },
            (error, data) => {
                if (error) {
                    reject(new Error(`Could not determine the location of Bedrock's asset files. There was an error reading the mcpe-launcher versions.ini file.\nPath: ${error.path}\nCode: ${error.code}`));
                }
                else {
                    // Parse the list of versions
                    const { sections } = parseIni(data);
                    const versions = [...sections.values()]
                        .map(parseVersionSection)
                        .filter(v => !Number.isNaN(v.versionCode) && v.versionName);

                    // Find the latest
                    let maxVersion = versions[0];
                    for (const version of versions) {
                        if (version.versionCode > maxVersion.versionCode) maxVersion = version;
                    }

                    if (!maxVersion) {
                        reject(new Error(`Could not determine the location of Bedrock's asset files. The mcpe-launcher versions file did not contain a valid version (or the format has been changed).\nPath: ${versionsIni}`));
                    }
                    else {
                        resolve(path.join(rootInstallPath, "versions", maxVersion.versionName, "assets"));
                    }
                }
            }
        );
    });
}

/*
 * Note: Android assets are contained in the .apk file. To find the .apk file,
 * run `cmd package list packages -f com.mojang.minecraftpe` in an adb shell.
 * Example:
 * ```
 * $ cmd package list packages -f com.mojang.minecraftpe
 * package:/data/app/com.mojang.minecraftpe-hyJ8nvp8-uvUFJn09B9F-g==/base.apk=com.mojang.minecraftpe
 * ```
 */

interface MCPEVersion {
    versionCode: number;
    versionName: string;
}

/**
 * Parses a version information section from an mcpe-launcher versions file.
 * @param section The INI section.
 */
function parseVersionSection(section: Map<string, string>): MCPEVersion {
    return {
        versionCode: Number.parseInt(section.get("versionCode") as string),
        versionName: section.get("versionName") || "",
    };
}

interface IniData {
    global: Map<string, string>;
    sections: Map<string, Map<string, string>>;
}

/**
 * Parses an INI file.
 * @param data The file data.
 */
function parseIni(data: string): IniData {
    const iniData = {
        global: new Map<string, string>(),
        sections: new Map<string, Map<string, string>>()
    };
    const lines = data.split("\n");
    let currentSection = iniData.global;
    for (const line in lines) {
        // Blank line or comment
        if (!line || line.startsWith(";")) {
            continue;
        }
        // Section header
        if (line.startsWith("[") && line.endsWith("]")) {
            currentSection = new Map<string, string>();
            iniData.sections.set(line.slice(1, -1), currentSection);
            continue;
        }
        // Key/value
        const [key, value] = line.split("=", 2);
        currentSection.set(key, value);
    }
    return iniData;
}


