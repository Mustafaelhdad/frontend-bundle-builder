import type { AssetReference } from '../../../types/bundle-builder'
import wyzeBatteryCamProBlack from '../../../assets/products/Wyze-Battery-Cam-Pro/Wyze-Battery-Cam-Pro-black.png'
import wyzeBatteryCamProWhite from '../../../assets/products/Wyze-Battery-Cam-Pro/Wyze-Battery-Cam-Pro-white.png'
import wyzeBatteryCamProMain from '../../../assets/products/Wyze-Battery-Cam-Pro/Wyze-Battery-Cam-Pro.png'
import wyzeCamFloodlightV2Black from '../../../assets/products/Wyze-Cam-Floodlight-v2/Wyze-Cam-Floodlight-v2-black.png'
import wyzeCamFloodlightV2White from '../../../assets/products/Wyze-Cam-Floodlight-v2/Wyze-Cam-Floodlight-v2-white.png'
import wyzeCamFloodlightV2Main from '../../../assets/products/Wyze-Cam-Floodlight-v2/Wyze-Cam-Floodlight-v2.png'
import wyzeDuoCamDoorbell from '../../../assets/products/Wyze-Duo-Cam-Doorbell/Wyze-Duo-Cam-Doorbell.png'
import wyzeCamPanV3Black from '../../../assets/products/wyze-cam-pan-v3/wyze-cam-pan-v3-black.png'
import wyzeCamPanV3Main from '../../../assets/products/wyze-cam-pan-v3/wyze-cam-pan-v3.png'
import wyzeCamPanV3White from '../../../assets/products/wyze-cam-pan-v3/wyze-cam-pan-v3-white.png'
import wyzeCamV4Black from '../../../assets/products/wyze-cam-v4/Wyze Cam v4 black.png'
import wyzeCamV4Grey from '../../../assets/products/wyze-cam-v4/Wyze Cam v4 grey.png'
import wyzeCamV4White from '../../../assets/products/wyze-cam-v4/Wyze Cam v4 white.png'
import wyzeCamV4Main from '../../../assets/products/wyze-cam-v4/Wyze_Cam_V4_01.0001.png'
import { Icon, type IconName } from '../../../components/ui'

type AssetPlaceholderProps = {
  asset: AssetReference
  className?: string
}

export function AssetPlaceholder({ asset, className }: AssetPlaceholderProps) {
  const imageSrc = assetImageByKey[asset.assetKey]
  const iconName = assetIconByKey[asset.assetKey]

  if (imageSrc) {
    return (
      <div className={className} title={asset.assetKey}>
        <img
          alt={asset.alt}
          className="h-full w-full object-contain"
          draggable={false}
          src={imageSrc}
        />
      </div>
    )
  }

  if (iconName) {
    return (
      <div className={className} title={asset.assetKey}>
        <Icon decorative={false} label={asset.alt} name={iconName} size={24} />
      </div>
    )
  }

  return (
    <div
      aria-label={asset.alt}
      className={className}
      role="img"
      title={asset.assetKey}
    >
      <span className="sr-only">{asset.alt}</span>
      <div className="h-full w-full rounded-[24px] bg-[radial-gradient(circle_at_50%_42%,rgb(31_31_31_/_12%),rgb(31_31_31_/_4%)_45%,transparent_72%)]" />
    </div>
  )
}

const assetImageByKey: Record<string, string> = {
  'wyze-battery-cam-pro-black': wyzeBatteryCamProBlack,
  'wyze-battery-cam-pro-main': wyzeBatteryCamProMain,
  'wyze-battery-cam-pro-white': wyzeBatteryCamProWhite,
  'wyze-cam-floodlight-v2-black': wyzeCamFloodlightV2Black,
  'wyze-cam-floodlight-v2-main': wyzeCamFloodlightV2Main,
  'wyze-cam-floodlight-v2-white': wyzeCamFloodlightV2White,
  'wyze-cam-pan-v3-black': wyzeCamPanV3Black,
  'wyze-cam-pan-v3-main': wyzeCamPanV3Main,
  'wyze-cam-pan-v3-white': wyzeCamPanV3White,
  'wyze-cam-v4-black': wyzeCamV4Black,
  'wyze-cam-v4-grey': wyzeCamV4Grey,
  'wyze-cam-v4-main': wyzeCamV4Main,
  'wyze-cam-v4-white': wyzeCamV4White,
  'wyze-duo-cam-doorbell': wyzeDuoCamDoorbell,
}

const assetIconByKey: Record<string, IconName> = {
  'cam-unlimited-shield': 'cam-unlimited-shield',
}
