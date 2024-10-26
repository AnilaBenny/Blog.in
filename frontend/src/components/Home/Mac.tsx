import  { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Mac({ ...props }) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/macos/mac-draco.glb");
  
  return (
    //@ts-ignore
    <group ref={group} {...props} dispose={null} scale={[0.5, 0.5, 0.5]}>
      <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh
          material={materials.aluminium}
          //@ts-ignore
          geometry={nodes["Cube008"].geometry}
        />
        <mesh
          material={materials["matte.001"]}
          //@ts-ignore
          geometry={nodes["Cube008_1"].geometry}
        />
        <mesh
          material={materials["screen.001"]}
          //@ts-ignore
          geometry={nodes["Cube008_2"].geometry}
        />
      </group>
    </group>
  );
}
