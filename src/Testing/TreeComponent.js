import { Grid } from "@progress/kendo-react-grid";
export default function TreeComponent(props) {
  const { data } = props;
  return (
    <>
      <div>
        <Grid style={{ maxWidth: 1200, width: 1100 }} data={data} />
      </div>
    </>
  );
}
