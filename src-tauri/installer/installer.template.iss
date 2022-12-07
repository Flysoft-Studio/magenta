; Copyright (C) Flysoft.

#define AppName "Magenta Player"
#define AppVersion "{version}"
#define AppPublisher "Flysoft"
#define AppOutName "magenta-player"
#define AppBaseDir "..\.."
#define AppExePath "{executable}"
#define AppCopyrightYear "{year}"
#define AppCommit "{commit}"
#define AppArch "{arch}"
#define AppAllowedArch "{allowed_arch}"

[Setup]
AppId={{F9C18145-18E5-42FE-9E2E-F2C0A91B957E}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#AppPublisher}
AppCopyright=Copyright (C) {#AppPublisher} {#AppCopyrightYear}
DefaultDirName={autopf}\{#AppName}
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog
OutputDir={#AppBaseDir}\out
OutputBaseFilename={#AppOutName}-setup-v{#AppVersion}-{#AppCommit}-{#AppArch}
SetupIconFile={#AppBaseDir}\src-tauri\icons\icon.ico
Compression=lzma
SolidCompression=yes
ArchitecturesAllowed={#AppAllowedArch}
WizardStyle=modern
LanguageDetectionMethod=uilanguage
ShowLanguageDialog=no 

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "chinesesimplified"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"

[CustomMessages]
chinesesimplified.EarlyTestVersionWarning=此版本为 {#AppName} 的早期测试版本，存在很多功能上的缺失和 bug，不代表正式版用户体验。%n%n点击“是”即代表您已经知悉以上内容。
english.EarlyTestVersionWarning=%n%nThis is an early test version of {#AppName} which may be unreliable. Not indicative of final version.%n%nBy clicking "Yes", you read, understand, and agree the above contents.

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "{#AppExePath}"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#AppBaseDir}\src-tauri\installer\MicrosoftEdgeWebview2Setup.exe"; DestDir: "{tmp}"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\{#AppName}"; Filename: "{app}\{#AppExeName}"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#AppExeName}"; Tasks: desktopicon

[Run]
Filename: "{tmp}\MicrosoftEdgeWebview2Setup.exe"; Parameters: "/silent /install"; WorkingDir: {tmp}; Flags: skipifdoesntexist; StatusMsg: "Microsoft Edge Webview2"; Check: IsWebview2InstallationRequired  
Filename: "{app}\{#AppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(AppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[Code]
procedure SplitString(str, delim: string; var dest: TArrayOfString);
var
    temp: string;
    i, p: integer;
begin
  temp := str;
  i := StringChangeEx(temp, delim, '', true);
  SetArrayLength(dest, i + 1);
  for i := 0 to GetArrayLength(dest) - 1 do
    begin
    p := Pos(delim, str);
      if p > 0 then
      begin
      dest[i] := Copy(str, 1, p - 1);
      Delete(str, 1, p + Length(delim) - 1);
      end
    else
      dest[i] := str;
    end;
end;

function IsWebview2InstallationRequired(): boolean;  
var  
    success: boolean;
    version: string;  
    versions: TArrayOfString; 
    required: boolean;
begin  
    required := true;
    success := RegQueryStringValue(HKLM, 'SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}', 'pv', version);
    if success = false then
      success := RegQueryStringValue(HKCU, 'SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}', 'pv', version);
    if success = true then
      SplitString(version, '.', versions);
      if GetArrayLength(versions) = 4 then
        if StrToInt(versions[0]) > 100 then
          required := false;
    Result := required;  
end;  

function InitializeSetup(): boolean;
begin
  Result := MsgBox(ExpandConstant('{cm:EarlyTestVersionWarning}'), mbError, MB_YESNO) = IDYES;
end;