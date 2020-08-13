; BEAUMONT Anthony
; Xan
; 15/03/2019
; -------------------------
; Aion JP Voice Pack Setup
; -------------------------

[Setup]
#define AppName "Aion Japanese Voice Pack"
#define OurVersion "152"
#define Author "Xan"
#define Website "https://xan105.github.io/Aion-Japanese-Voice-Pack/"
#define Copyright "© 2012-2019"
#define webRoot "https://raw.githubusercontent.com/xan105/Aion-Japanese-Voice-Pack/setup/"
#define DonationURL "https://www.paypal.me/xan105"

AppId={{CCACDF0D-8843-4C54-9646-F968016F79E5}
AppName={#AppName}
AppVerName={#AppName}
AppVersion={#OurVersion}
VersionInfoVersion={#OurVersion}
VersionInfoCopyright={#Copyright} {#Author}
AppPublisher={#Author}
AppPublisherURL={#Website}
VersionInfoDescription={#AppName}
DefaultDirName={code:GetAionDir}\Voice Pack\
  DirExistsWarning=no
Compression=zip
DiskSpanning=no
OutputDir=output
  OutputBaseFilename=Aion.Japanese.Voice.Pack.Setup
SolidCompression=no
AllowRootDirectory=yes
DisableWelcomePage=yes
DisableReadyPage=yes
DisableDirPage=yes
DisableFinishedPage=no
DisableProgramGroupPage=yes
SetupIconFile=resources\icon_jp.ico
WizardSmallImageFile=resources\logo_jp.bmp
WizardImageFile=resources\left.bmp
Uninstallable=yes
UninstallFilesDir={userappdata}\Aion Japanese Voice Pack\

[Languages]
Name: "en"; MessagesFile: "compiler:Default.isl"

[Messages]
FinishedHeadingLabel={#AppName}%nSetup Wizard

[CustomMessages]
en.InstallingLabel=Japanising your Aion...
en.ButtonDonate=Donate

#include <idp.iss>
[Files]
Source: "resources\ncsoft_logo.bmp"; DestDir: "{tmp}" ;Flags: ignoreversion overwritereadonly
Source: "resources\plaync_logo.bmp"; DestDir: "{tmp}" ;Flags: ignoreversion overwritereadonly
Source: "resources\4game_logo.bmp"; DestDir: "{tmp}" ;Flags: ignoreversion overwritereadonly
Source: "resources\shandagame_logo.bmp"; DestDir: "{tmp}" ;Flags: ignoreversion overwritereadonly
Source: "..\voice pack\*"; Excludes: "README.txt,version.ini"; DestDir: "{code:GetAionDir}\L10N\{code:GetUserLocale}\sounds"; Flags: ignoreversion overwritereadonly recursesubdirs; 
Source: "..\font\jp hit font\hit_number.pak"; DestDir: "{code:GetAionDir}\L10N\{code:GetUserLocale}\textures\ui" ;Flags: ignoreversion overwritereadonly; Check: ReturnBonusToInstall(0)
Source: "..\font\kor hit font\hit_number.pak"; DestDir: "{code:GetAionDir}\L10N\{code:GetUserLocale}\textures\ui" ;Flags: ignoreversion overwritereadonly; Check: ReturnBonusToInstall(1)
Source: "..\font\kor system font\fonts.pak"; DestDir: "{code:GetAionDir}\L10N\{code:GetUserLocale}\data\fonts" ;Flags: ignoreversion overwritereadonly; Check: ReturnBonusToInstall(2)


[Code]
// superglobales
var CheckListBox: TNewCheckListBox;
var BonusCheckListBox: TNewCheckListBox;
var user_choose: string;
var critical_hit_font: string;
var text_font: string;
var Aion_Chinese_Name : string;
//end superglobales


function GetLocale (region: string) : string;
var
  locale: string;
begin
  if region = 'NA' then begin
      locale:= 'ENU';
  end else if region = 'KR' then begin
      locale:= 'KOR';
  end else if region = 'JP' then begin
      locale:= 'JPN';
  end else if region = 'RU' then begin
      locale:= 'RUS';
  end else if region = 'CN' then begin
      locale:= 'CHS';
  end;
     Result := locale;
end;

function GetUserLocale (Param: String): String;
var 
  response: string;
begin
     if user_choose = 'NA' then begin
        response := GetLocale('NA');
     end else if user_choose = 'KR' then begin
        response := GetLocale('KR');
     end else if user_choose = 'JP' then begin
        response := GetLocale('JP');
     end else if user_choose = 'RU' then begin
        response := GetLocale('RU');
     end else if user_choose = 'CN' then begin
        response := GetLocale('CN');
     end;
     Result := response;
end;

function GetAionDir(Param: String) : String;
var
 aionDir: string;
begin
  if user_choose = 'NA' then begin
        RegQueryStringValue(HKLM, 'Software\NCWest\AION','BaseDir',aionDir);
  end else if user_choose = 'KR' then begin
        RegQueryStringValue(HKLM, 'Software\PlayNC\AION_KOR','BaseDir',aionDir);
  end else if user_choose = 'JP' then begin
        RegQueryStringValue(HKLM, 'Software\PlayNC\AION_JP','BaseDir',aionDir);
  end else if user_choose = 'RU' then begin
        RegQueryStringValue(HKLM, 'Software\4game\4gameservice\Games\Aion','path',aionDir);
  end else if user_choose = 'CN' then begin
        RegQueryStringValue(HKLM, 'Software\shandagames\'+Aion_Chinese_Name,'Path',aionDir);
  end;
  Result:= aionDir;
end;

function GetAionVersionSelectedByUser(Page: TWizardPage): Boolean;
begin

  if CheckListBox.checked[0] then begin
    user_choose := 'NA';
    Result := True;
  end else if CheckListBox.checked[1] then begin
    user_choose := 'RU';
    Result := True;
  end else if CheckListBox.checked[2] then begin
    user_choose := 'CN';
    Result := True;
  end else if CheckListBox.checked[3] then begin
    user_choose := 'KR';
    Result := True;
  end else begin
     Result := False;
  end;

end;                      

procedure SelectAionVersionPage;
var
  Page: TWizardPage;
  Header: TLabel;
  BitmapFileName: String;
  Image: array [0..3] of TBitmapImage;
begin
Page := CreateCustomPage(wpInfoBefore, 'Aion Japanese Voice Pack', 'Select Aion Version ');
Page.OnNextButtonClick := @GetAionVersionSelectedByUser;

  Header := TLabel.Create(Page);
  Header.Top := ScaleY(5);
  Header.Left := ScaleX(0);
  Header.AutoSize := True;
  Header.Parent := Page.Surface;
  Header.Caption :=  'Please select which installed version of Aion in your system you would like to modify:';

  BitmapFileName := ExpandConstant('{tmp}\ncsoft_logo.bmp');
  ExtractTemporaryFile(ExtractFileName(BitmapFileName));
  Image[0] := TBitmapImage.Create(Page);
  Image[0].Bitmap.LoadFromFile(BitmapFileName);
  Image[0].Parent := Page.Surface;
  Image[0].Left := ScaleX(30);
  Image[0].Width := 25;
  Image[0].Height := 20;
  Image[0].Top := ScaleY(30);

  BitmapFileName := ExpandConstant('{tmp}\4game_logo.bmp');
  ExtractTemporaryFile(ExtractFileName(BitmapFileName));
  Image[1] := TBitmapImage.Create(Page);
  Image[1].Bitmap.LoadFromFile(BitmapFileName);
  Image[1].Parent := Page.Surface;
  Image[1].Left := ScaleX(30);
  Image[1].Width := 25;
  Image[1].Height := 20;
  Image[1].Top := ScaleY(70);

  BitmapFileName := ExpandConstant('{tmp}\shandagame_logo.bmp');
  ExtractTemporaryFile(ExtractFileName(BitmapFileName));
  Image[2] := TBitmapImage.Create(Page);
  Image[2].Bitmap.LoadFromFile(BitmapFileName);
  Image[2].Parent := Page.Surface;
  Image[2].Left := ScaleX(30);
  Image[2].Width := 25;
  Image[2].Height := 20;
  Image[2].Top := ScaleY(115);

  BitmapFileName := ExpandConstant('{tmp}\plaync_logo.bmp');
  ExtractTemporaryFile(ExtractFileName(BitmapFileName));
  Image[3] := TBitmapImage.Create(Page);
  Image[3].Bitmap.LoadFromFile(BitmapFileName);
  Image[3].Parent := Page.Surface;
  Image[3].Left := ScaleX(0);
  Image[3].Width := 62;
  Image[3].Height := 20;
  Image[3].Top := ScaleY(155);

  CheckListBox := TNewCheckListBox.Create(Page);
  CheckListBox.Top := ScaleY(20);
  CheckListBox.Left := ScaleX(70);
  CheckListBox.Width := Page.SurfaceWidth;
  CheckListBox.Height := ScaleY(250);
  CheckListBox.BorderStyle := bsNone;
  CheckListBox.ParentColor := True;
  CheckListBox.MinItemHeight := WizardForm.TasksList.MinItemHeight+20;
  CheckListBox.ShowLines := False;
  CheckListBox.WantTabs := True;
  CheckListBox.Parent := Page.Surface;
           
  CheckListBox.AddRadioButton('Aion NA <NCWest>', '', 0, false, false, nil);
  CheckListBox.AddRadioButton('Aion RU <4Game>', '', 0, false, false, nil);
  CheckListBox.AddRadioButton('Aion CN <Shandagame>', '', 0, false, false, nil);
  CheckListBox.AddRadioButton('Aion KR <PlayNC>', '', 0, false, false, nil);

  if RegValueExists(HKLM, 'Software\PlayNC\AION_KOR', 'BaseDir')then begin
      CheckListBox.ItemEnabled[3] := True;
      CheckListBox.checked[3] := True;
  end;

  if RegValueExists(HKLM, 'Software\shandagames\'+Aion_Chinese_Name, 'Path')then begin
      CheckListBox.ItemEnabled[2] := True;
      CheckListBox.checked[2] := True;
  end;

  if RegValueExists(HKLM, 'Software\4game\4gameservice\Games\Aion', 'path')then begin
      CheckListBox.ItemEnabled[1] := True;
      CheckListBox.checked[1] := True;
  end;

  if RegValueExists(HKLM, 'Software\NCWest\Aion', 'BaseDir')then begin
      CheckListBox.ItemEnabled[0] := True;
      CheckListBox.checked[0] := True;
  end;

end;


function ReturnBonusToInstall (bonus: integer): Boolean;
begin

  if bonus = 0 then begin
         if critical_hit_font = 'default' then begin
               Result := False;
         end else if critical_hit_font = 'JP' then begin
              Result := True;
         end;
  end else if bonus = 1 then begin
         if critical_hit_font = 'default' then begin
               Result := False;
         end else if critical_hit_font = 'KR' then begin
              Result := True;
         end;
  end else if bonus = 2 then begin
         if text_font = 'default' then begin
               Result := False;
         end else if text_font = 'KR' then begin
              Result := True;
         end;
  end;

end;


function GetBonusToInstallSelectedByUser(Page: TWizardPage): Boolean;
begin

  if BonusCheckListBox.checked[1] then begin
    critical_hit_font := 'default';
    Result := True;
  end else if BonusCheckListBox.checked[2] then begin
    critical_hit_font := 'JP';
    Result := True;
  end else if BonusCheckListBox.checked[3] then begin
    critical_hit_font := 'KR';
    Result := True;
  end else begin
     Result := False;
  end;
  
  if BonusCheckListBox.checked[5] then begin
    text_font := 'default';
    Result := True;
  end else if BonusCheckListBox.checked[6] then begin
    text_font := 'KR';
    Result := True;
  end else begin
     Result := False;
  end;

  
end;

procedure SelectBonusToInstallPage;
var
  Page: TWizardPage;
  Header: TLabel;
  Text: TNewStaticText;
begin          
Page := CreateCustomPage(wpUserInfo, 'Aion Japanese Voice Pack', 'Select Bonus To Install');
Page.OnNextButtonClick := @GetBonusToInstallSelectedByUser;

Header := TLabel.Create(Page);
Header.Top := ScaleY(0);
Header.Left := ScaleX(0);
Header.AutoSize := True;
Header.Parent := Page.Surface;
Header.Caption :=  'If you don''t know or don''t care about this you can safely skip this page.'

BonusCheckListBox := TNewCheckListBox.Create(Page);
BonusCheckListBox.Top := ScaleY(20);
BonusCheckListBox.Left := ScaleX(0);
BonusCheckListBox.Width := Page.SurfaceWidth;
BonusCheckListBox.Height := ScaleY(250);
BonusCheckListBox.BorderStyle := bsNone;
BonusCheckListBox.ParentColor := True;
BonusCheckListBox.MinItemHeight := WizardForm.TasksList.MinItemHeight;
BonusCheckListBox.ShowLines := True;
BonusCheckListBox.WantTabs := True;
BonusCheckListBox.Parent := Page.Surface;

Text := TNewStaticText.Create(Page);
Text.Parent := Page.Surface;
Text.Left := 0;
Text.Top := ScaleY(20);
Text.Font.Style := [fsBold, fsUnderline];
Text.Caption := 'Critical Hit font';
BonusCheckListBox.AddGroup(#13#10+'Aion KR and JP ship with a special font when a Critical, Evade, Parry or Block arise.', '', 0, nil);
BonusCheckListBox.AddRadioButton('Default Hit font', '', 1, true, true, nil);
BonusCheckListBox.AddRadioButton('JP Hit font', '', 1, false, true, nil);
BonusCheckListBox.AddRadioButton('KR Hit font (Korean char.)', '', 1, false, true, nil);

Text := TNewStaticText.Create(Page);
Text.Parent := Page.Surface;
Text.Left := 0;
Text.Top := ScaleY(115);
Text.Font.Style := [fsBold, fsUnderline];
Text.Caption := 'Text Font';
BonusCheckListBox.AddGroup(#13#10+'Aion KR ships with a different font for text.', '', 0, nil);
BonusCheckListBox.AddRadioButton('Default font', '', 1, true, true, nil);
BonusCheckListBox.AddRadioButton('KR font', '', 1, false, true, nil);
end;

procedure GoToWebsite(Sender: TObject);
var 
  ResultCode: Integer;
begin
    ShellExec('','{#Website}', '', '', SW_SHOW, ewNoWait, ResultCode);
end;

procedure GoToDonation(Sender: TObject);
var 
  ResultCode: Integer;
begin
    ShellExec('','{#DonationURL}', '', '', SW_SHOW, ewNoWait, ResultCode);
end;

procedure CreateCopyright;
var
  Copyright: TLabel;
  CopyrightURL: TLabel;
begin
  Copyright := TLabel.Create(WizardForm);
  Copyright.Top := WizardForm.NextButton.top - ScaleY(6);
  Copyright.Left := ScaleX(20);
  Copyright.Caption := '{#Copyright} {#Author}';
  Copyright.AutoSize := True;
  Copyright.Parent := WizardForm;
  CopyrightURL := TLabel.Create(WizardForm);
  CopyrightURL.Top := Copyright.Top + ScaleY(15); 
  CopyrightURL.Left := Copyright.Left;
  CopyrightURL.Caption := '{#Website}';
  CopyrightURL.Cursor := crHand;
  CopyrightURL.Font.Color := clBlue;
  CopyrightURL.Font.Style := [fsUnderline];
  CopyrightURL.AutoSize := True;
  CopyrightURL.Parent := WizardForm;
  CopyrightURL.OnClick:= @GoToWebsite;
end;

procedure InstallLabel;
begin
  with TNewStaticText.Create(WizardForm) do
  begin
    Parent := WizardForm.FilenameLabel.Parent;
    Left := WizardForm.FilenameLabel.Left;
    Top := WizardForm.FilenameLabel.Top;
    Width := WizardForm.FilenameLabel.Width;
    Height := WizardForm.FilenameLabel.Height;
    Caption := ExpandConstant('{cm:InstallingLabel}');
  end;
  WizardForm.FilenameLabel.Visible := False;
end;

function CompareVersions(this, that:string):integer;
var thisField, thatField:integer;
begin
 while (length(this)>0) or (length(that)>0) do begin
   if (pos('.',this)>0) then begin
     thisField:=StrToIntDef(Copy(this, 1, pos('.',this)-1),0);
     this:=Copy(this, pos('.',this)+1, length(this));
   end else begin
     thisField:=StrToIntDef(this, 0);
     this:='';
   end;

   if (pos('.',that)>0) then begin
     thatField:=StrToIntDef(Copy(that, 1, pos('.',that)-1),0);
     that:=Copy(that, pos('.',that)+1, length(that));
   end else begin
     thatField:=StrToIntDef(that, 0);
     that:='';
   end;

   if thisField>thatField then begin
    result:=1;
    exit;
   end else if thisField<thatField then begin
    result:=-1;
    exit;
   end;
 end;

 result:=0;
end;

procedure IsThisLastestVoicePack();
var
 remote_version, local_version, text, url: string;
begin                                        
  local_version:='{#OurVersion}';
  idpSetOption('UserAgent',      'Chrome/');
  idpSetOption('InvalidCert',    'ignore');
  idpSetOption('ConnectTimeout', '1200000');
  idpSetOption('SendTimeout', '600000');
  idpSetOption('ReceiveTimeout', '600000');
  
  if idpDownloadFile('{#webRoot}version.ini',expandconstant('{tmp}\version.ini')) then begin    
    remote_version := GetIniString('setup', 'version', '0', expandconstant('{tmp}\version.ini'));
    url := GetIniString('setup', 'url', '{#Website}', expandconstant('{tmp}\version.ini'));

    if CompareVersions(trim(remote_version), trim(local_version))>0 then begin
        text:='This Voice Pack is outdated !'+#13#10+'A new version (v %1) is available at'+#13#10+'%2';
        StringChangeEx(text, '%1', remote_version, true);
        StringChangeEx(text, '%2', url, true);
        MsgBox(text, mbInformation, MB_OK)
    end;
  end;

end;                  

//Main
procedure InitializeWizard();
begin
    Aion_Chinese_Name := #$6C38 + #$6052 + #$4E4B + #$5854; //永恒之塔
    IsThisLastestVoicePack;
    CreateCopyright;
    InstallLabel;
    SelectAionVersionPage;
    SelectBonusToInstallPage;                                  
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
 if(CurStep = ssInstall) then begin
   
     if critical_hit_font = 'default' then begin
        DelTree(GetAionDir('0')+'\L10N\'+GetUserLocale('0')+'\textures\ui', True, True, True);
     end;

     if text_font = 'default' then begin  
        DelTree(GetAionDir('0')+'\L10N\'+GetUserLocale('0')+'\data\fonts', True, True, True);
     end;

 end;

end;

procedure CurPageChanged(CurPageID: Integer);
var
  DonateButton: TNewButton;
begin
  WizardForm.BackButton.Enabled := False;
  WizardForm.BackButton.Visible := False;

  if CurPageID = wpFinished then begin
    DonateButton := TNewButton.Create(WizardForm);
    DonateButton.Parent := WizardForm;
    DonateButton.Left := WizardForm.CancelButton.Left;
    DonateButton.Top := WizardForm.CancelButton.Top;
    DonateButton.Width := WizardForm.CancelButton.Width;
    DonateButton.Height := WizardForm.CancelButton.Height;
    DonateButton.Caption := ExpandConstant('&{cm:ButtonDonate}');
    DonateButton.OnClick := @GoToDonation;
  end;

end;