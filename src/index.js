import { AssetCard, Grid, Autocomplete, Stack } from '@contentful/f36-components'
import { setup } from '@contentful/dam-app-base'
import React, { useState } from 'react'
import { render } from 'react-dom'

// PLUG DAM RESPONSE HERE (or where this is consumed)
const dam = {
  folderA: [
    {
      id: "foo",
      title: "Foo",
      url: "https://img.freepik.com/premium-vector/hand-drawn-vintage-foo-dog-chinese-lion-culture-illustration-tattoo-black-white_41901-479.jpg?w=360"
    },
    {
      id: "bar",
      title: "Bar",
      url: "https://img.freepik.com/premium-vector/foo-dog-head-artwork-illustration_536870-220.jpg?w=2000"
    },
  ],
  folderB: [
    {
      id: "baz",
      title: "Baz",
      url: "https://cdn.dribbble.com/users/2583351/screenshots/5310587/media/656527ccc3910411a2e1e07d07e57a81.jpg?compress=1&resize=400x300"
    },
    {
      id: "boo",
      title: "boo",
      // filters out assets without URLs
    },
  ]
}

function ExternalAssetCard({ asset, onClick }) {
  return (
    <AssetCard
      status="published"
      type="image"
      title={asset.title}
      src={asset.url}
      onClick={() => onClick(asset)}
      size="small"
   />
  )
}

function ExternalAssetCardList({ assets, onClick }) {
  return (
    <Grid style={{ width: '100%' }} columns={3}>
      {assets.filter(asset => !!asset.url).map((asset) => {
        return <ExternalAssetCard key={asset.id} asset={asset} onClick={onClick} />
      })}
    </Grid>
  )
}

function ExternalAssetCardDialog({ sdk }) {
  const allFolders = Object.keys(dam)
  const [availableFolders, setAvailableFolders] = React.useState(allFolders);
  const [selectedFolder, setFolder] = useState(allFolders[0])

  const [assetList, setAssets] = useState(dam[selectedFolder])

  const onClickAsset = (asset) => sdk.close([asset])

  const handleInputValueChange = (value) => {
    const newAvailableFolders = allFolders.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase()),
    )
    setAvailableFolders(newAvailableFolders)
  }

  const onFolderChange = (folder) => {
    setFolder(folder)
    setAssets(dam[folder])
  }

  return (
    <Stack flexDirection="column" alignItems="start">
      <Autocomplete
        items={availableFolders}
        defaultValue={selectedFolder}
        onInputValueChange={handleInputValueChange}
        onSelectItem={onFolderChange}
      />
      <ExternalAssetCardList assets={assetList} onClick={onClickAsset} />
    </Stack>
  )
}

setup({
  cta: 'Select asset',
  name: 'My DAM App',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/1200px-Picture_icon_BLACK.svg.png',
  color: '#d7f0fa',
  description: 'My example DAM App',
  parameterDefinitions: [],
  validateParameters: () => true,
  makeThumbnail: asset => [asset.url, asset.title],
  renderDialog: async (sdk) => {
    render(<ExternalAssetCardDialog sdk={sdk} />, document.getElementById('root'))
    sdk.window.startAutoResizer()
  },
  openDialog: async (sdk, currentValue, config) => {
    const result = await sdk.dialogs.openCurrentApp({
      parameters: { config, currentValue },
      position: 'center',
      title: 'Select an asset',
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      width: 800,
      minHeight: 600,
      allowHeightOverflow: true,
    })

    if (!Array.isArray(result)) {
      return []
    }

    return result
  },
  isDisabled: () => false
})
