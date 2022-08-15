import { setup } from '@contentful/dam-app-base'

const ADOBE_DOMAIN = 'TEST_DOMAIN' // #REPLACE_ME
const ADOBE_DAM_HOST = `https://${ADOBE_DOMAIN}.adobecqms.net`
const ADOBE_ORGANIZATION = 'TEST_DAM/ORG_NAME' // #REPLACE_ME
const ADOBE_DAM_URL = `${ADOBE_DAM_HOST}/aem/assetpicker.html/content/dam/${ADOBE_ORGANIZATION}?assettype=images`

async function assetSelected(event, sdk) {
  const { data } = event
  await sdk.field.setValue([...await sdk.field.getValue(), JSON.parse(data)])
}

setup({
  cta: 'Select asset',
  name: 'My DAM App',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/1200px-Picture_icon_BLACK.svg.png',
  color: '#d7f0fa',
  description: 'My example DAM App',
  parameterDefinitions: [],
  validateParameters: () => true,
  makeThumbnail: asset => [asset.img, asset.title],
  renderDialog: async (sdk) => false,
  openDialog: async (sdk, currentValue, config) => {
    sdk.window.startAutoResizer()
    window.addEventListener('message', async (e) => {
      if (e.origin !== ADOBE_DAM_HOST) return
      await assetSelected(e, sdk)
    })
    window.open(ADOBE_DAM_URL, '_new')
  },
  isDisabled: () => false
})
