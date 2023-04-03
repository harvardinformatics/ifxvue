import IFXItemBase from '@/components/item/IFXItemBase'

class ReportRun extends IFXItemBase {
  get report() {
    return this.data.report
  }

  get dateRange() {
    return this.data.date_range
  }

  get textFilePath() {
    return this.data.text_file_path
  }

  get textFileUrl() {
    return `${this.data.url_root}/${this.data.text_file_path}`
  }

  get xlsFilePath() {
    return this.data.xls_file_path
  }

  get xlsFileUrl() {
    return `${this.data.url_root}/${this.data.xls_file_path}`
  }

  get updated() {
    return this.data.updated
  }
}
export { ReportRun }
